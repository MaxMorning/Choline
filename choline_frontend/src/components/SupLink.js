import React, { Component } from 'react';
import './SupLink.css';

export default class SupLink extends Component {
    constructor(props) {
        super(props);

        this.state = {
            href: props.href,
            newWindow: props.newWindow,
            // children: props.children,
            isHover: false
        };
    }

    // handleMouseEnter() {
    //     this.setState({
    //         isHover: true
    //     });
    //     console.log('Enter')
    // };

    // handleMouseLeave() {
    //     this.setState({
    //         isHover: false
    //     });
    //     console.log('Leave')
    // };

    componentDidMount() {
        
    }

    onClick = () => {
        if (this.state.newWindow) {
            window.open(this.state.href);
        }
        else {
            window.location.href = this.state.href;
        }
    }


    render() {
        // console.log(this.state.children)
        return <a onClick={this.onClick} style={{
            color: '#f8f8f8',
            // textDecoration: this.state.isHover ? 'underline' : 'none'
        }}>
            {this.props.children}
        </a>
    }
}
