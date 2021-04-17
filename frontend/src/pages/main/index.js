import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import './css/index.css'

import isAuth from '../../utils/is_auth'

import '../../utils/is_auth'



export default class MainPage extends React.Component {
    constructor() {
        super()
    }

    redirect(path) {
        window.location.replace(path);
    }

    componentDidMount() {
        isAuth()
    }
    render() {
        return (
            <div className="container main">
                <Header page_name="Bustail"/>
                <div className="main__menu">
                    <div onClick={() => this.redirect('/app/create')} className="main__menu__btn__create-app">
                        <p>Создать заявку</p>
                    </div>
                    <div onClick={() => this.redirect('/transport/create')} className="main__menu__btn__create-transport">
                        <p>Предложить аренду</p>
                    </div>
                    <div className="main__menu__btn__find">
                        <div id="text">
                            <p>Поиск</p>
                        </div>
                        <div onClick={() => this.redirect('/transport/search')} id="transport">
                            <p>Транспорт</p>
                        </div>
                        <div onClick={() => this.redirect('/app/search')} id="apps">
                            <p>Заказы</p>
                        </div>
                    </div>
                    <div onClick={() => this.redirect('/cabinet')} className="main__menu__btn__cabinet">
                        <p>Личный кабинет</p>
                    </div>
                </div>
                <NavBar/>
            </div>
        )
    }
    
}
