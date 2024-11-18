import React, { Component } from 'react';
import { Button, Layout, Input, Typography, Flex, Select, Image, message } from 'antd';

import UserContent from './components/UserContent';
import AssistantContent from './components/AssistantContent';

const { Sider, Content } = Layout;
const { Title } = Typography;

const exampleLLMList = ['qwen2.5-coder:7b', 'llama3.2-vision:11b', 'llama3.1:8b']
const exampleChatMessage = [
    {
        "role": "user",
        "time": "2024-11-11 12:45:04",
        "content": "why is the sky blue?",
        "images": ["data:image/png;base64,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"]
    },
    {
        "role": "assistant",
        "time": "2024-11-11 12:55:34",
        "content": "due to rayleigh scattering."
    },
    {
        "role": "user",
        "time": "2024-11-12 01:55:04",
        "content": "how is that different than mie scattering?"
    },
    {
        "role": "assistant",
        "time": "2024-11-12 12:55:34",
        "content": `
## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins

## Contents

Here is an example of a plugin in action
([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
**This section is replaced by an actual table of contents**.


\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'


ReactDOM.render(
  <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
  document.querySelector('#content')
)
\`\`\`


`
    }
]

export default class MainPageApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagList: exampleLLMList,
            tagLoading: false,
            tagLoaded: false,

            messages: exampleChatMessage,
            inputValue: '',

            imageBase64: ""
        };

        this.tagSelection = null;
    }

    componentDidMount() {
        document.title = 'Choline'
    }
  
    handleTagSelection = (value) => {
        this.tagSelection = value;
    };

    handleSendMessage = () => {
        const { inputValue, messages } = this.state;
        if (inputValue.trim()) {
            this.setState({
            messages: [...messages, inputValue],
            inputValue: '',
            });
        }
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

    setBase64String = (baseStr) => {
        // console.log(baseStr)
        this.setState({imageBase64: baseStr})
    }

    convertToPng = (dataUrl) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          // 将图像导出为 PNG 格式的 Base64
          const pngBase64String = canvas.toDataURL('image/png');
          this.setBase64String(pngBase64String);
          message.success('Image converted to PNG and uploaded successfully!');
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
            this.setState({tagLoaded: false})
        }
        else {
            // 加载
            this.setState({tagLoading: true})

            setTimeout(() => {
                this.setState({
                    tagLoading: false,
                    tagLoaded: true
                })
            }, 2000);
        }
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
                            <Select size='large' options={this.tagsToSelectOptions(this.state.tagList)} style={{width: '75%'}} disabled={this.state.tagLoaded} onChange={this.handleTagSelection} />
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
                        
                        <Button size='large' style={{width: '100%'}}>清空上下文</Button>
                        <Button size='large' style={{width: '100%'}}>重写</Button>
                        <Button size='large' style={{width: '100%'}}>翻译成英语</Button>
                        <Button size='large' style={{width: '100%'}}>翻译成中文</Button>
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
                        { this.state.tagLoaded ? this.tagSelection : 'OLLAMA'}
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
                    >
                        {chatHistoryList}
                    </Flex>
                    <Flex gap='middle' align='flex-end' style={{ flex: '0 0 auto', padding: '0 7vw', marginTop: '16px', width: '100%' }}>
                        <Button size="large">粘贴</Button>
                        <Button size='large' onClick={this.handleImageUploadButtonClick}>{this.state.imageBase64.length > 0 ? '清除图像' : '选择图像'}</Button>
                        {this.state.imageBase64.length === 0 ? 
                            null
                            :
                            <Image
                                width='8vw'
                                src={this.state.imageBase64}
                            />
                        }
                        <Input.TextArea
                            value={this.state.inputValue}
                            onChange={(e) => this.setState({ inputValue: e.target.value })}
                            onPressEnter={this.handleSendMessage}
                            placeholder="问点什么吧..."
                            size="large"
                            autoSize={{
                                maxRows: 6,
                            }}
                            style={{width: '100%'}}
                        />
                        <Button type="primary" onClick={this.handleSendMessage} size="large">发送</Button>
                    </Flex>
                </Content>
            </Layout>
        );
    }
  }
