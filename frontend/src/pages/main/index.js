import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import './css/index.css'


function MainPage() {
    let redirect = (path) => {
        window.location.replace(path);
    }
    return (
        <div className="container main">
            <Header page_name="Bustail"/>
            <div className="main__menu">
                <div onClick={() => redirect('/app/create')} className="main__menu__btn__create-app">
                    <p>Создать заявку</p>
                </div>
                <div onClick={() => redirect('/transport/create')} className="main__menu__btn__create-transport">
                    <p>Предложить аренду</p>
                </div>
                <div className="main__menu__btn__find">
                    <div id="text">
                        <p>Поиск</p>
                    </div>
                    <div onClick={() => redirect('/transport/search')} id="transport">
                        <p>Транспорт</p>
                    </div>
                    <div onClick={() => redirect('/app/search')} id="apps">
                        <p>Заказы</p>
                    </div>
                </div>
                <div onClick={() => redirect('/cabinet')} className="main__menu__btn__cabinet">
                    <p>Личный кабинет</p>
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default MainPage