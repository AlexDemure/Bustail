import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'

import NewSendMessageForm from './new_send_msg'


class MainFormRegistration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: []
        }
    }

    getCities() {
        sendRequest('/api/v1/cities/', "GET")
        .then(
            (data) => {
                console.log(data);
                this.setState({cities: data});
            }
        )
    }

    componentDidMount(){
        this.getCities()
    }


    render() {
        return (
        <React.Fragment>
            <AuthSwitch is_active="reg"/>
            <form className="registration__form__create-new-user" onSubmit={this.props.onSubmit}>
                <SearchInput name="city" placeholder="Город"  options={this.state.cities}/>
                <DefaultInput parser="lowercase" name="email" input_type="email" size="25" placeholder="Электронная почта"/>
                <DefaultInput name="hashed_password" input_type="password" size="25" placeholder="Пароль"/>
                {
                    this.props.error &&
                    <div className="registration__form__create-new-user__error-text">
                        <p>{this.props.error}</p>
                    </div>
                }
                
                <SubmitButton/>
            </form>
        </React.Fragment>
    )
    }
}


function ConfirmEmailFormRegistration(props) {
    return (
        <React.Fragment>
            <form className="registration__form__confirm-email" onSubmit={props.onSubmit}>
                <DefaultInput name="code" input_type="text" size="25" placeholder="Код подтверждения"/>
                {
                    props.error &&
                    <div className="registration__form__confirm-email__error-text">
                        <p>{props.error}</p>
                    </div>
                }
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
            email: "",
            error: null
        };
        this.newUser = this.newUser.bind(this);
        this.confirmEmail = this.confirmEmail.bind(this);
    }

    newUser(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target));
        let data = {
            email: prepared_data.get("email"),
            city: prepared_data.get("city"),
            hashed_password: prepared_data.get("hashed_password"),

        };

        sendRequest('/api/v1/accounts/', "POST", data)
        .then(
            (result) => {
                console.log(data);
                
                localStorage.setItem('token', result.access_token);
                
                this.setState({
                    form: "confirm",
                    email: prepared_data.get("email"),
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

    confirmEmail(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        let data = {code: prepared_data.get("code")};

        sendRequest('/api/v1/accounts/confirm/', "POST", data, localStorage.getItem("token"))
        .then(
            (data) => {
                console.log(data);
                window.location.replace("/main");
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

        if (this.state.form === "confirm") {
            form = <ConfirmEmailFormRegistration error={this.state.error} email={this.state.email} onSubmit={this.confirmEmail}/>
        }else{
            form = <MainFormRegistration error={this.state.error} onSubmit={this.newUser}/>
        }
        return (
            <div className="registration__form">
                {form}
            </div>
        )
    }
}