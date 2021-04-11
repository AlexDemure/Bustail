import React from 'react'

import './css/menu.css'

import RedirectButton from '../common/buttons/redirect_btn'

function Menu(props) {
    return (
        <div className="form-menu">
            <div id="header">
                <div id="page_name">Меню</div>
                <div id="menu" onClick={props.changeState}></div>
            </div>
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
            <RedirectButton link="/" text="Выйти"/>
            <div id="contacts">
                <p id="email">Email: <span>bustail@support.com</span></p>
                <a href="tel:+79191231251" id="phone">Телефон: <span>+7 (351) 223-12-51</span></a>
            </div>
            
        </div>
    )
} 

export default Menu
