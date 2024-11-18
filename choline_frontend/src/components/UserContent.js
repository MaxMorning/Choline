import React, { Component } from 'react';
import { Flex, Image, Card, Typography } from 'antd';

const { Text, Link } = Typography;


export default class UserContent extends Component {
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
                <Text type='secondary'>{'User\t' + this.state.info.time}</Text>
                <Card style={{backgroundColor: '#C9EAFF'}}>
                    <Flex gap='small' vertical justify='flex-start'>
                        <Text>{this.state.info.content}</Text>
                        {this.state.info.images ? (
                            <Image src={this.state.info.images[0]} width='10vw'/>
                        ) : null}
                    </Flex>
                </Card>
            </Flex>
        )
    }
}