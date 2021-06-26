import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import isAuth from '../../utils/is_auth'


import './css/index.css'


export default class MainPage extends React.Component {
    constructor() {
        super()

        this.state = {
            is_auth: null
        }
    }

    async componentDidMount() {
        let is_auth = isAuth(false)
        
        this.setState({
            is_auth: is_auth
        })

    }
    render() {
        return (
            <React.Fragment>
                <Header page_name="Bustail"/>

                <div className="container main">
                    <div className="main__menu">
                        <div onClick={() => window.location.replace('/app/create')} className={`main__menu__btn__create-app ${this.state.is_auth ? '' : 'disable'} `}>
                            <p>Создать заявку</p>
                        </div>
                        <div onClick={() => window.location.replace('/transport/create')} className={`main__menu__btn__create-transport ${this.state.is_auth ? '' : 'disable'} `}>
                            <p>Предложить аренду</p>
                        </div>
                        <div className="main__menu__btn__find">
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
                        <div onClick={() => window.location.replace('/cabinet')} className={`main__menu__btn__cabinet ${this.state.is_auth ? '' : 'disable'} `}>
                            <p>Личный кабинет</p>
                        </div>
                    </div>
                </div>
                
                <NavBar/>
            </React.Fragment>
        )
    }
    
}
