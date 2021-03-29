import React from 'react'

import '../css/base.css'

import DefaultInput from '../../common/inputs/default'

import SendFormBtn from '../../common/buttons/send_form_btn'
import AuthSwitch from '../../common/swithes/auth'

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
    }
    render() {
        return (
            <React.Fragment>
                <AuthSwitch is_active="login"/>
                <form className="form_login" onSubmit={this.login}>
                    <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
                    <DefaultInput input_type="password" size="25" placeholder="Пароль"/>
                    <SendFormBtn value="Войти"/>
                </form>
            </React.Fragment>
        )
    }
}

