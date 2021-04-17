import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'

import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'


export default class AuthForm extends React.Component {
    constructor() {
        super();

        this.state = {
            error: null
        }
        this.login = this.login.bind(this);
    }

    async loginResponse(data) {
        const bad_responses = [401, 403, 404]
        const response = await fetch('/api/v1/login/access-token/', {
            method: "POST",
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            body: data
        });

        if (response.ok) {
            return await response.json()
        } else {
            if (bad_responses.includes(response.status)) {
                let error = await response.json()
                throw new Error(error.detail) 
            } else {
                throw new Error(response.statusText)
            }
            
        }
        
    }
    login(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let data = new URLSearchParams(
            {
                username: prepared_data.get("email"),
                password: prepared_data.get("password")
            }
        )

        this.loginResponse(data)
        .then(
            (result) => {
                localStorage.setItem('token', result.access_token)
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
                    <DefaultInput name="email" input_type="email" size="25" placeholder="Электронная почта"/>
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

