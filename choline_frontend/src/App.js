import React, { Component } from 'react';
import { Button, Layout, Input, Typography, Flex, Select, Image as AntdImage , message } from 'antd';

import UserContent from './components/UserContent';
import AssistantContent from './components/AssistantContent';
import Requester from './utils/Requester';

const { Sider, Content } = Layout;
const { Title } = Typography;

const exampleLLMList = ['qwen2.5-coder:7b', 'llama3.2-vision:11b', 'llama3.1:8b']


Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

function convertGmtToCst(gmtTime) {
    // 创建一个 Date 对象，解析 GMT 时间
    const gmtDate = new Date(gmtTime);
    
    // 获取时间戳（毫秒）
    const timestamp = gmtDate.getTime();
    
    // CST 比 GMT 多 8 小时，所以需要加上 8 * 60 * 60 * 1000 毫秒
    const cstTimestamp = timestamp + 8 * 60 * 60 * 1000;
    
    // 创建一个新的 Date 对象，使用 CST 时间戳
    const cstDate = new Date(cstTimestamp);
    
    // 格式化日期和时间
    const year = cstDate.getFullYear();
    const month = String(cstDate.getMonth() + 1).padStart(2, '0');
    const day = String(cstDate.getDate()).padStart(2, '0');
    const hours = String(cstDate.getHours()).padStart(2, '0');
    const minutes = String(cstDate.getMinutes()).padStart(2, '0');
    const seconds = String(cstDate.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export default class MainPageApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: exampleLLMList,
            tagLoading: false,
            tagLoaded: false,
            tagSelection: null,

            // messages: exampleChatMessage,
            messages: [],
            inputValue: '',

            imageBase64: ""
        };

        this.chatHistoryLLM = []
        this.scrollContainer = React.createRef();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    componentDidMount() {
        document.title = 'Choline'

        this.getTags();
        this.scrollToBottom();
    }

    getTags() {
        Requester.requestJSON(
            {
                method: 'get',
                url: '/api/tags'
            },
            (response) => {
                let modelList = [];
                let rawData = response.data.models;

                for (let i = 0; i < rawData.length; i++) {
                    modelList.push(rawData[i].name)
                }

                Requester.requestJSON(
                    {
                        method: 'get',
                        url: '/api/ps'
                    },
                    (response) => {
                        let rawData = response.data.models;
        
                        if (rawData.length > 0) {
                            this.setState({
                                tagList: modelList,
                                tagSelection: rawData[0].name,
                                tagLoaded: true
                            })
                        }
                        else {
                            this.setState({
                                tagList: modelList,
                            })
                        }
                    },
                    (error) => {
                        message.error('当前模型列表获取错误');
                    }
                )

                this.setState({tagList: modelList})
            },
            (error) => {
                message.error('模型列表获取错误');
            }
        )
    }
  
    handleTagSelection = (value) => {
        this.setState({tagSelection: value});
    };

    onPasteClick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            this.setState({inputValue: this.state.inputValue + text})
        } catch (err) {
            console.error('Failed to read clipboard contents:', err);
        }
    };

    handleSendMessage = () => {
        let newUserMessage = {
            "role": "user",
            "time": new Date().format("yyyy-MM-dd hh:mm:ss"),
            "content": this.state.inputValue,
            "images": this.state.imageBase64 ? [this.state.imageBase64] : null
        }

        let newAssistantMessage = {
            "role": "assistant",
            "time": new Date().format("yyyy-MM-dd hh:mm:ss"),
            "content": null
        }

        let oldMessageList = this.state.messages;
        oldMessageList.push(newUserMessage);
        oldMessageList.push(newAssistantMessage);

        this.setState({
            messages: oldMessageList,
            inputValue: '',
            imageBase64: ''
        })
        this.scrollToBottom();

        // Prepare messages sent to LLM
        let messageSent2LLM = {
            "role": "user",
            "content": this.state.inputValue,
        }
        if (newUserMessage["images"]) {
            messageSent2LLM["images"] = [newUserMessage["images"][0].substring(22)]
            // console.log(messageSent2LLM.images)
        }

        this.chatHistoryLLM.push(messageSent2LLM);

        Requester.requestJSON(
            {
                method: 'post',
                url: '/api/chat',

                data: {
                    "model": this.state.tagSelection,
                    "messages": this.chatHistoryLLM,
                    "stream": false
                }
            },
            (response) => {
                let responseData = response.data;
                let responseTime = convertGmtToCst(responseData['created_at'].substring(0, 19).replace('T', ' '));

                let responseContent = responseData['message']['content']

                let currentMessageList = this.state.messages;
                currentMessageList.at(-1)['time'] = responseTime;
                currentMessageList.at(-1)['content'] = responseContent;

                this.chatHistoryLLM.push({
                    "role": "assistant",
                    "content": responseContent
                })

                this.setState({
                    messages: currentMessageList
                })
                this.scrollToBottom();
            },
            (error) => {
                message.error('发送失败');
            }
        )
    };

    
    tagsToSelectOptions(tag_list) {
        let select_options = []
        for (let i = 0; i < tag_list.length; i++) {
            select_options.push({
                value: tag_list[i],
                label: tag_list[i],
            })
        }

        return select_options;
    }

    // setBase64String = (baseStr) => {
    //     // console.log(baseStr)
    //     this.setState({imageBase64: baseStr})
    // }

    setBase64String = (baseStr) => {
        if (baseStr.substring(11, 14) === 'png') {
            this.setState({imageBase64: baseStr})

            return;
        }

        // Create a new Image object
        const img = new Image();
        img.src = baseStr;

        // Wait for the image to load
        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Convert the canvas content to PNG format and get the Base64 string
            const pngBase64 = canvas.toDataURL('image/png');
            
            this.setState({imageBase64: pngBase64})
        };
    };

    handleImageUploadButtonClick = () => {
        if (this.state.imageBase64.length > 0) {
            this.setState({imageBase64: ""})
            return
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setBase64String(reader.result);
                message.success('Image uploaded successfully!');
            };
            reader.readAsDataURL(file);
            } else {
            message.error('Please select a valid image file.');
            }
        };
        input.click();
    };

    handleLoadClick = () => {
        if (this.state.tagLoaded) {
            // 卸载
            Requester.requestJSON(
                {
                    method: 'post',
                    url: '/api/chat',
                    data: {
                        "model": this.state.tagSelection,
                        "messages": [],
                        "keep_alive": 0
                    }
                },
                (response) => {
                    this.setState({tagLoaded: false})
                },
                (error) => {
                    message.error('卸载失败');
                }
            )
            
        }
        else {
            // 加载
            this.setState({tagLoading: true})
            Requester.requestJSON(
                {
                    method: 'post',
                    url: '/api/chat',
                    data: {
                        "model": this.state.tagSelection,
                        "messages": [],
                        "keep_alive": -1
                    }
                },
                (response) => {
                    this.setState({tagLoaded: true})
                    this.setState({tagLoading: false})
                },
                (error) => {
                    message.error('加载失败');
                    this.setState({tagLoading: false})
                }
            )
        }
    }

    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (!this.state.tagLoaded) {
                message.error('模型未加载');
                return;
            }
            if (event.shiftKey) {
                this.setState({inputValue: this.state.inputValue + '\n'})
            }
            else {
                this.handleSendMessage()
                this.setState({inputValue: ''})
            }
        }
    };

    scrollToBottom() {
        this.scrollContainer.current.scrollIntoView({ behavior: "smooth" });
    }
  
    render() {

        // get chat history
        let chatHistoryList = []
        for (let i = 0; i < this.state.messages.length; i++) {
            if (this.state.messages[i].role === 'user') {
                chatHistoryList.push(<UserContent info={this.state.messages[i]} />)
            }
            else {
                chatHistoryList.push(<AssistantContent info={this.state.messages[i]} />)
            }
        }
  
        return (
            <Layout style={{ height: '100vh' }}>
                <Sider width={'15vw'} style={{ background: '#dddddd', padding: '16px' }}>
                    <Flex
                        vertical
                        gap='small'
                        justify='center'
                        align='center'
                        style={{
                            height: '100%'
                        }}>
                        {/* Left panel */}
                        <Flex gap='small' style={{width: '100%'}}>
                            <Select
                                size='large'
                                options={this.tagsToSelectOptions(this.state.tagList)}
                                style={{width: '75%'}}
                                disabled={this.state.tagLoaded}
                                onChange={this.handleTagSelection} 
                                value={this.state.tagSelection}/>
                            <Button
                                size='large'
                                type='primary'
                                danger={this.state.tagLoaded}
                                loading={this.state.tagLoading}
                                style={{width: '25%'}}
                                onClick={this.handleLoadClick}
                            >
                                {this.state.tagLoaded? '卸载' : '加载'}
                            </Button>
                        </Flex>
                        
                        <Button size='large' style={{width: '100%'}} 
                            disabled={!this.state.tagLoaded}
                            onClick={() => {
                                this.chatHistoryLLM = [];
                                this.setState({messages: []})
                            }} >清空上下文</Button>
                        <Button size='large' style={{width: '100%'}} onClick={() => {
                            this.setState({inputValue: 'rewrite: ' + this.state.inputValue})
                        }}>重写</Button>
                        <Button size='large' style={{width: '100%'}} onClick={() => {
                            this.setState({inputValue: 'translate to English: ' + this.state.inputValue})
                        }}>翻译成英语</Button>
                        <Button size='large' style={{width: '100%'}} onClick={() => {
                            this.setState({inputValue: 'translate to Chinese: ' + this.state.inputValue})
                        }}>翻译成中文</Button>
                        <Button size='large' style={{width: '100%'}} onClick={() => {
                            this.setState({inputValue: '用中文回答: ' + this.state.inputValue})
                        }}>用中文回答</Button>
                    </Flex>
                </Sider>
                <Content style={{
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    }}>
                    <div style={{ flex: '0 0 auto', marginBottom: '16px' }}>
                    <Title level={2} align='center'>
                        { this.state.tagLoaded ? this.state.tagSelection : 'OLLAMA'}
                    </Title>
                    </div>
                    <Flex
                        gap='middle'
                        vertical
                        style={{
                            flex: '1 1 auto',
                            overflowY: 'auto',
                            border: '1px solid #d9d9d9',
                            padding: '16px',
                            borderRadius: '4px',
                        }}
                        id='ChatHistoryFlex'
                    >
                        {chatHistoryList}
                        <div ref={this.scrollContainer} />
                    </Flex>
                    <Flex gap='middle' align='flex-end' style={{ flex: '0 0 auto', padding: '0 7vw', marginTop: '16px', width: '100%' }}>
                        <Button size="large" onClick={this.onPasteClick} >粘贴</Button>
                        <Button size='large' onClick={this.handleImageUploadButtonClick}>{this.state.imageBase64.length > 0 ? '清除图像' : '选择图像'}</Button>
                        {this.state.imageBase64.length === 0 ? 
                            null
                            :
                            <AntdImage
                                width='8vw'
                                src={this.state.imageBase64}
                            />
                        }
                        <Input.TextArea
                            value={this.state.inputValue}
                            onChange={(e) => {
                                this.setState({ inputValue: e.target.value })
                            }}
                            placeholder="问点什么吧..."
                            size="large"
                            autoSize={{
                                maxRows: 6,
                            }}
                            style={{width: '100%'}}
                            onKeyDown={this.handleKeyDown}
                        />
                        <Button type="primary" onClick={this.handleSendMessage} size="large" disabled={!this.state.tagLoaded}>发送</Button>
                    </Flex>
                </Content>
            </Layout>
        );
    }
  }
