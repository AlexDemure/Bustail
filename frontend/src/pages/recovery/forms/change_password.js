import React from 'react'

import '../css/base.css'

import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'


function ChangePasswordForm(props) {
    return (
        <div className="form">
            <form className="form_recovery" onSubmit={props.onSubmit}>
                <DefaultInput input_type="password" size="25" placeholder="Новый пароль"/>
                <DefaultInput input_type="password" size="25" placeholder="Подтверждение пароля"/>
                <SubmitButton value="Сменить пароль"/>
            </form>
        </div>
    )
}


export default class RecoveryForm extends React.Component {
    constructor() {
        super();
        this.state = {
            form: "recovery",
        };

        this.changePassword = this.changePassword.bind(this);
    }

    changePassword(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        this.setState({
            form: "notify"
        })
        console.log(prepared_data);

        // TODO FETCH
    }
    render() {
        let form;

        if (this.state.form === "recovery") {
            form = <ChangePasswordForm onSubmit={this.changePassword}/>
        }else{
            form = <Notify type="changed_password" link="/login" text="Войти"/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}

