import React from 'react'

import './css/header.css'

import Menu from './menu'

export default class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            is_active: false
        }
        this.changeState = this.changeState.bind(this)
    }

    changeState() {
        this.setState({
            is_active: !this.state.is_active
        })
    }

    render() {
        let divItem;
    
        if (this.props.previous_page) {
            divItem = <a href={this.props.previous_page} id="left"><div id="left"/></a>
        } else {
            divItem = <div id="none"/>
        }

        return (
            <header>
                {divItem}
                <div id="page_name">
                    {this.props.page_name ? this.props.page_name : "Bustail"}
                </div>
                <div id="menu">
                    <div id="icon" onClick={this.changeState}/>
                    {
                        this.state.is_active && (
                            <Menu changeState={this.changeState}/>
                        )
                    }
                </div>
            </header>
        )
    }
}
