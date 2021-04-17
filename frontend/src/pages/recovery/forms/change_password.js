import React from 'react'

import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'


function ChangePasswordForm(props) {
    return (
        <form className="recovery__form__change-password" onSubmit={props.onSubmit}>
            <DefaultInput name="new_password" input_type="password" size="25" placeholder="Новый пароль"/>
            <DefaultInput name="repeat_password" input_type="password" size="25" placeholder="Подтверждение пароля"/>
            {
                props.error &&
                <div className="recovery__form__change-password__error-text">
                    <p>{props.error}</p>
                </div>
            }
            <SubmitButton value="Сменить пароль"/>
        </form>
    )
}


export default class RecoveryForm extends React.Component {
    constructor() {
        super();
        this.state = {
            form: "recovery",
            error: null
        };

        this.changePassword = this.changePassword.bind(this);
    }

    changePassword(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        if (prepared_data.get("new_password") !== prepared_data.get("repeat_password")) {
            this.setState({
                error: "Пароли не совпадают."
            })
            return
        }
        
        let token = new URLSearchParams(window.location.search).get("token")
        if (token === null) {
            this.setState({
                error: "Ссылка для смены пароля истекла получите новую ссылку."
            })
            return
        }

        let data = {password: prepared_data.get('new_password')}

        sendRequest('/api/v1/accounts/change_password?security_token=' + token, "PUT", data)
        .then(
            (result) => {
                console.log(result);
                
                this.setState({
                    form: "notify",
                    error: null
                })
            },
            (error) => {
                console.log(error.message);
                this.setState({
                    error: error.message
                })
            }
        )
    }
    render() {
        let form;

        if (this.state.form === "recovery") {
            form = <ChangePasswordForm error={this.state.error} onSubmit={this.changePassword}/>
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

