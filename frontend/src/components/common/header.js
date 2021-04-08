import React from 'react'

import './css/header.css'
import './css/menu.css'

import RedirectBtn from '../common/buttons/redirect_btn'

function Menu() {
    return (
        <div className="form-menu">
            <div id="choices">
                <ul>
                    <li><a href="/">Главная</a></li>
                    <li><a href="/main">Меню</a></li>
                    <li><a href="/history">История</a></li>
                    <li><a href="/notifications">Уведомления</a></li>
                    <li><a href="/cabinet">Личный кабинет</a></li>
                    <li><a href="/#contacts">Контакты</a></li>
                </ul>
            </div>
            <RedirectBtn link="/" text="Выйти"/>
            <div id="contacts">
                <p id="email">Email: <span>bustail@support.com</span></p>
                <a href="tel:+79191231251" id="phone">Телефон: <span>+7 (351) 223-12-51</span></a>
            </div>
            
        </div>
    )
} 


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
            divItem = <a href={this.props.previous_page} id="left"><div id="left"></div></a>
        } else {
            divItem = <div id="none"></div>
        }

        return (
            <header>
                {divItem}
                <div id="page_name">
                    {this.props.page_name ? this.props.page_name : "Bustail"}
                </div>
                <div id="menu-btn" onClick={this.changeState}></div>
                {
                    this.state.is_active && (
                        <Menu/>
                    )
                }
            </header>
        )
    }
}
