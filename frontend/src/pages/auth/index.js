import React from 'react'

import PreviewBanner from '../../components/common/preview_banner'

import AuthForm from './forms/login'
import isAuth from '../../utils/is_auth'

import './css/index.css'


export default class AuthPage extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        let clientIsAuth = isAuth()
        if (clientIsAuth === true) {
            window.location.replace('/main')
        }
    }

    render() {
        return (
            <div className="container auth">
                <PreviewBanner/>
                <div className="auth__body">
                    <AuthForm/>
                    <p className="auth__body__reset-password">Забыли пароль? <a href="/recovery">Восстановить</a></p>
                </div>
                <div className="auth__footer"></div>
            </div>
        )
    }
    
}
