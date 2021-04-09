import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import './css/main.css'


function MainPage() {
    let redirect = (path) => {
        window.location.replace(path);
    }
    return (
        <div className="container main">
            <Header page_name="Bustail"/>
            <div className="menu">
                <div onClick={() => redirect('/app/create')} className="create_app">
                    <p>Создать заявку</p>
                </div>
                <div onClick={() => redirect('/transport/create')} className="create_transport">
                    <p>Предложить аренду</p>
                </div>
                <div className="find">
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
                <div onClick={() => redirect('/cabinet')} className="cabinet">
                    <p>Личный кабинет</p>
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default MainPage