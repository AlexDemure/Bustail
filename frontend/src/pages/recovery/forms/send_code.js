import React from 'react'


import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'


function SendCodeForm(props) {
    return (
        <form className="recovery__form__send-code" onSubmit={props.onSubmit}>
            <DefaultInput name="email" input_type="email" size="25" placeholder="Электронная почта"/>
            {
                props.error &&
                <div className="recovery__form__send-code__error-text">
                    <p>{props.error}</p>
                </div>
            }
            <SubmitButton value="Отправить код"/>
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

        this.sendCode = this.sendCode.bind(this);
    }

    sendCode(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let data = {email: prepared_data.get("email")}

        sendRequest('/api/v1/mailing/change_password/', "POST", data)
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
            form = <SendCodeForm error={this.state.error} onSubmit={this.sendCode}/>
        }else{
            form = <Notify type="recovery" link="/login" text="Войти"/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}

