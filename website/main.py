import aiohttp
from aiohttp import web
import aiofiles
import os
import requests

ALLOW_IP_ADDRESS = ['127.0.0.1']  # 允许的IP地址列表
SERVER_PORT = 32044
OLLAMA_PORT = 11434

async def ip_filter_middleware(app, handler):
    async def middleware_handler(request):
        allowed_ips = ALLOW_IP_ADDRESS
        client_ip = request.remote

        if client_ip not in allowed_ips:
            return web.Response(status=403, text="Forbidden")

        response = await handler(request)
        return response

    return middleware_handler

async def handle_main(request):
    # 指定主页面的路径
    index_path = os.path.join(os.getcwd(), 'build', 'index.html')
    if os.path.exists(index_path):
        return web.FileResponse(index_path)
    else:
        raise web.HTTPNotFound(text="Index page not found")

async def handle(request):
    # 获取请求的路径
    path = request.path[1:]

    # 构建文件路径
    file_path = os.path.join('build', path)

    # 检查文件是否存在
    if not os.path.exists(file_path):
        return web.Response(status=404)

    # 读取文件内容
    async with aiofiles.open(file_path, mode='rb') as f:
        content = await f.read()

    # 根据文件扩展名设置 Content-Type
    if path.endswith('.js') or path.endswith('.jsx'):
        content_type = 'application/javascript'
    elif path.endswith('.jpg') or path.endswith('.jpeg'):
        content_type = 'image/jpeg'
    elif path.endswith('.png'):
        content_type = 'image/png'
    elif path.endswith('.gif'):
        content_type = 'image/gif'
    elif path.endswith('.css') or path.endswith('.scss'):
        content_type = 'text/css'
    elif path.endswith('.json'):
        content_type = 'application/json'
    else:
        content_type = 'text/html'

    # 返回响应
    return web.Response(body=content, content_type=content_type)

async def get_proxy_handler(request):
    path = request.match_info['path']
    response = requests.get(f"http://127.0.0.1:{OLLAMA_PORT}/api/{path}", headers=request.headers, params=request.query)
    return web.json_response(status=response.status_code, text=response.text)

async def post_proxy_handler(request):
    path = request.match_info['path']
    content = await request.content.read()
    response = requests.post(f"http://127.0.0.1:{OLLAMA_PORT}/api/{path}", headers=request.headers, params=request.query, data=content)
    return web.json_response(status=response.status_code, text=response.text)

if __name__ == '__main__':
    print('Server starting...')

    app = web.Application(middlewares=[ip_filter_middleware])
    app.router.add_get('/', handle_main)
    app.router.add_get('/{path:.*}', handle)
    app.router.add_get('/api/{path}', get_proxy_handler)
    app.router.add_post('/api/{path}', post_proxy_handler)

    web.run_app(app, port=SERVER_PORT)
