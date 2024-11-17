import React, { Component } from 'react';
import { Button, Layout, Input, Typography, Flex, Space } from 'antd';
// import 'antd/dist/antd.css'; // 确保引入 Ant Design 的样式

const { Sider, Content } = Layout;
const { Title } = Typography;


export default class MainPageApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            inputValue: '',
        };
    }

    componentDidMount() {
        document.title = 'Choline'
    }
  
    handleSendMessage = () => {
        const { inputValue, messages } = this.state;
        if (inputValue.trim()) {
            this.setState({
            messages: [...messages, inputValue],
            inputValue: '',
            });
        }
    };
  
    render() {
      const { messages, inputValue } = this.state;
  
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
                <Title level={2} align='center'>OLLAMA</Title>
                </div>
                <div
                    style={{
                        flex: '1 1 auto',
                        overflowY: 'auto',
                        border: '1px solid #d9d9d9',
                        padding: '16px',
                        borderRadius: '4px',
                    }}
                >
                    {messages.map((msg, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                        {msg}
                        </div>
                    ))}
                </div>
                <Flex gap='middle' style={{ flex: '0 0 auto', padding: '0 10vw', marginTop: '16px', width: '100%' }}>
                    <Button size="large">粘贴</Button>
                    <Input.TextArea
                        value={inputValue}
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
