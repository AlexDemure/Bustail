import React from 'react'

import '../css/base.css'

import DefaultInput from '../../../components/common/inputs/default'

import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import SerializeForm from '../../../utils/form_serializer'


export default class AuthForm extends React.Component {
    constructor() {
        super();
        this.login = this.login.bind(this);
    }

    login(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);
        // TODO FETCH

        window.location.replace("/main");
    }
    render() {
        return (
            <React.Fragment>
                <AuthSwitch is_active="login"/>
                <form className="form_login" onSubmit={this.login}>
                    <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
                    <DefaultInput input_type="password" size="25" placeholder="Пароль"/>
                    <SubmitButton value="Войти"/>
                </form>
            </React.Fragment>
        )
    }
}

