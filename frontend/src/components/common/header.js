import React from 'react'

import isAuth from '../../utils/is_auth'

import RedirectButton from '../common/buttons/redirect_btn'

import './css/header.css'
import './css/dropdown_menu.css'


function DropdownMenu(props) {
    let auth = () => {
        localStorage.removeItem("token")
        window.location.replace('/login')
    }

    return (
        <div className="dropdown-menu">
            <div className="dropdown-menu__list">
                <ul>
                    <li><a href="/">Главная</a></li>
                    <li><a href="/main">Меню</a></li>
                    <li><a className={props.is_auth ? '' : 'disable'} href="/history">История</a></li>
                    <li><a className={props.is_auth ? '' : 'disable'} href="/notifications">Уведомления</a></li>
                    <li><a className={props.is_auth ? '' : 'disable'} href="/cabinet">Личный кабинет</a></li>
                </ul>
            </div>
            <RedirectButton onClick={() => auth()} text={props.is_auth ? 'Выйти' : 'Войти'}/>
            <div className="dropdown-menu__docs">
                <a href="/docs/privecy" className="docs">Политика конфиденциальности</a>
                <a href="/docs/terms" className="docs">Пользовательское соглашение</a>
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

    async componentDidMount() {
        let is_auth = isAuth(false)
        
        this.setState({
            is_auth: is_auth
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
                        <DropdownMenu is_auth={this.state.is_auth}/>
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
