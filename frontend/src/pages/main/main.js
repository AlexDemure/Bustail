import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import './css/main.css'


function MainPage() {
    return (
        <div className="container main">
            <Header/>
            <div className="menu">
                <div onClick={() => window.location.replace('/app/create')} className="create_app">
                    <p>Создать заявку</p>
                </div>
                <div onClick={() => window.location.replace('/transport/create')} className="create_transport">
                    <p>Предложить аренду</p>
                </div>
                <div className="find">
                    <div id="text">
                        <p>Поиск</p>
                    </div>
                    <div onClick={() => window.location.replace('/transport/search')} id="transport">
                        <p>Транспорт</p>
                    </div>
                    <div onClick={() => window.location.replace('/app/search')} id="apps">
                        <p>Заказы</p>
                    </div>
                </div>
                <div onClick={() => window.location.replace('/cabinet')} className="cabinet">
                    <p>Личный кабинет</p>
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default MainPage