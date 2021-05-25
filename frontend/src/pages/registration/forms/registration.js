import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import InputPhone from '../../../components/common/inputs/phone'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import AuthSwitch from '../../../components/switches/auth'

import { getCities } from '../../../components/common/api/other/cities'
import { selectErrorInputs } from '../../../constants/input_parsers'
import { createAccount } from '../../../components/common/api/account/create'
import { confirmAccount } from '../../../components/common/api/account/confirm'

import SerializeForm from '../../../utils/form_serializer'

import NewSendMessageForm from './new_send_msg'


class MainFormRegistration extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            cities: []
        }
    }

    async componentDidMount(){
        let cities = await getCities()
        this.setState({cities: cities.result});
    }


    render() {
        return (
        <React.Fragment>
            <AuthSwitch is_active="reg"/>
            <form className="registration__form__create-new-user" onSubmit={this.props.onSubmit} autoComplete="off">
                <SearchInput name="city" placeholder="Город"  options={this.state.cities}/>
                <DefaultInput parser="lowercase" name="email" input_type="email" size="25" placeholder="Электронная почта"/>
                <InputPhone size="25"/>
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
                <label>Код подтверждения отправлен вам на почту</label>
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
        this.createAccount = this.createAccount.bind(this);
        this.confirmAccount = this.confirmAccount.bind(this);
    }

    async createAccount(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target));
        let data = {
            email: prepared_data.get("email"),
            phone: prepared_data.get("phone"),
            city: prepared_data.get("city"),
            hashed_password: prepared_data.get("hashed_password"),

        };

        let response = await createAccount(data)
        if (response.result !== null) {
            localStorage.setItem('token', response.result.access_token);
            localStorage.setItem('is_confirmed', false)
            
            this.setState({
                form: "confirm",
                email: prepared_data.get("email"),
                error: null
            })

        } else {
            if (response.error.name === "ValidationError") {
                selectErrorInputs(response.error.message)
                this.setState({
                    error: "Не корректно заполнены данные"
                })
            } else {
                this.setState({
                    error: response.error.message
                })
            }
        }
    }

    async confirmAccount(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let response = await confirmAccount(prepared_data.get("code"))
        
        if (response.result !== null) {
            localStorage.setItem('is_confirmed', true)
            window.location.replace("/main");
        
        } else {
            if (response.error.name === "ValidationError") {
                selectErrorInputs(response.error.message)
                this.setState({
                    error: "Код подтверждения состоит от 4 до 16 символов"
                })
            } else {
                this.setState({
                    error: response.error.message
                })
            }
        }
    }

    render() {
        let form;

        if (this.state.form === "confirm") {
            form = <ConfirmEmailFormRegistration error={this.state.error} email={this.state.email} onSubmit={this.confirmAccount}/>
        }else{
            form = <MainFormRegistration error={this.state.error} onSubmit={this.createAccount}/>
        }
        return (
            <div className="registration__form">
                {form}
            </div>
        )
    }
}