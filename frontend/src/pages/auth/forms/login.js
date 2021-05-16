import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'

import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import SerializeForm from '../../../utils/form_serializer'

import { getAuthToken } from '../../../utils/login'


export default class AuthForm extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        }
        this.login = this.login.bind(this);
    }

    login(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        getAuthToken(prepared_data.get("email"), prepared_data.get("password"))
        .then(
            (result) => {
                this.setState({error: null})
                window.location.replace("/main");
            },
            (error) => {
                this.setState({
                    error: error.message
                })
            }
        )
        
    }
    render() {
        return (
            <React.Fragment>
                <AuthSwitch is_active="login"/>
                <form className="auth__form__login" onSubmit={this.login}>
                    <DefaultInput name="email" input_type="email" parser="lowercase" size="25" placeholder="Электронная почта"/>
                    <DefaultInput name="password" input_type="password" size="25" placeholder="Пароль"/>
                    {
                    this.state.error &&
                    <div className="auth__form__login__error-text">
                        <p>{this.state.error}</p>
                    </div>
                }
                    <SubmitButton value="Войти"/>
                </form>
            </React.Fragment>
        )
    }
}

