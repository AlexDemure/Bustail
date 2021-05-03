import React from 'react'

import './css/header.css'
import './css/dropdown_menu.css'

import RedirectButton from '../common/buttons/redirect_btn'

function DropdownMenu() {
    let logout = () => {
        localStorage.removeItem("token")
        window.location.replace('/login')
    }

    return (
        <div className="dropdown-menu">
            <div className="dropdown-menu__list">
                <ul>
                    <li><a href="/">Главная</a></li>
                    <li><a href="/main">Меню</a></li>
                    <li><a href="/history">История</a></li>
                    <li><a href="/notifications">Уведомления</a></li>
                    <li><a href="/cabinet">Личный кабинет</a></li>
                </ul>
            </div>
            <RedirectButton onClick={() => logout()} text="Выйти"/>
            <div className="dropdown-menu__contacts">
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
            divItem = <a href={this.props.previous_page} className="header__common__previous-page"><div id="left"/></a>
        } else {
            divItem = <div/>
        }

        return (
            <React.Fragment>
                {
                    this.state.is_active && (
                        <DropdownMenu/>
                    )
                }
                <header>
                    {divItem}
                    <div className="header__common__page-name">
                        {this.props.page_name ? this.props.page_name : ""}
                    </div>
                    <div className="header__common__dropdown-btn" onClick={this.changeState}/>
                </header>

            </React.Fragment>
            
        )
    }
}
