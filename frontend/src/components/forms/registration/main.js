import React from 'react'
import '../css/base.css'

import NewSendMessageForm from '../common/new_send_msg'

import SerializeForm from '../../../utils/form_serializer'

import DefaultInput from '../../common/inputs/default'
import SearchInput from '../../common/inputs/search_selector'

import SendFormBtn from '../../common/buttons/send_form_btn'
import AuthSwitch from '../../common/swithes/auth'



function MainFormRegistration(props) {
    return (
        <React.Fragment>
            <AuthSwitch is_active="reg"/>
            <form className="form_new_user" onSubmit={props.onSubmit}>
                <SearchInput name="city" placeholder="Город"/>
                <DefaultInput parser="lowercase" name="email" input_type="email" size="25" placeholder="Электронная почта"/>
                <DefaultInput name="password" input_type="password" size="25" placeholder="Пароль"/>
                <SendFormBtn/>
            </form>
        </React.Fragment>
    )
}

function ConfirmEmailFormRegistration(props) {
    return (
        <React.Fragment>
            <form className="form_confirm_email" onSubmit={props.onSubmit}>
                <DefaultInput name="code" input_type="text" size="25" placeholder="Код подтверждения"/>
                <SendFormBtn/>
            </form>
            <NewSendMessageForm email={props.email}/>
        </React.Fragment>
    )
}


export default class RegistrationForm extends React.Component {

    constructor() {
        super();
        this.state = {
            form: "main",
            email: ""
        };
        this.newUser = this.newUser.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
    }

    newUser(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        this.setState({
            form: "confirm",
            email: prepared_data.get("email")
        })
        console.log(prepared_data);

        // TODO FETCH
    }

    confirmEmail(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        // TODO FETCH
        window.location.replace("/main");
    }


    render() {
        let form;

        if (this.state.form === "confirm") {
            form = <ConfirmEmailFormRegistration email={this.state.email} onSubmit={this.confirmEmail}/>
        }else{
            form = <MainFormRegistration onSubmit={this.newUser}/>
        }
        return (
            <div className="form">
                {form}
            </div>
        )
    }
}