import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import SerializeForm from '../../../utils/form_serializer'

import NewSendMessageForm from './new_send_msg'


function MainFormRegistration(props) {
    
    // TODO FETCH CITIES
    let cities = [
        "Челябинск", "Чебоксары", "Уфа", "Москва"
    ]

    return (
        <React.Fragment>
            <AuthSwitch is_active="reg"/>
            <form className="registration__form__create-new-user" onSubmit={props.onSubmit}>
                <SearchInput name="city" placeholder="Город"  options={cities}/>
                <DefaultInput parser="lowercase" name="email" input_type="email" size="25" placeholder="Электронная почта"/>
                <DefaultInput name="password" input_type="password" size="25" placeholder="Пароль"/>
                <SubmitButton/>
            </form>
        </React.Fragment>
    )
}

function ConfirmEmailFormRegistration(props) {
    return (
        <React.Fragment>
            <form className="registration__form__confirm-email" onSubmit={props.onSubmit}>
                <DefaultInput name="code" input_type="text" size="25" placeholder="Код подтверждения"/>
                <SubmitButton/>
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
            <div className="registration__form">
                {form}
            </div>
        )
    }
}