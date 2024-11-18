import React, { Component } from 'react';
import { Flex, Card, Typography } from 'antd';
import Markdown from 'react-markdown';
import MarkdownRenderer from './MarkdownRenderer';

const { Text, Link } = Typography;

export default class AssistantContent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            info: props.info
        };
    }

    componentDidMount() {
        
    }


    render() {
        return (
            <Flex gap='small' vertical justify='flex-start'>
                <Text type='secondary'>{'Assistant\t' + this.state.info.time}</Text>
                <Card style={{backgroundColor: '#EEEEEE'}}>
                    <MarkdownRenderer markdown={this.state.info.content} />
                </Card>
            </Flex>
        )
    }
}