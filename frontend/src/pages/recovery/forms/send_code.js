import React from 'react'


import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'


function SendCodeForm(props) {
    return (
        <form className="recovery__form__send-code" onSubmit={props.onSubmit}>
            <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
            <SubmitButton value="Отправить код"/>
        </form>
    )
}


export default class RecoveryForm extends React.Component {
    constructor() {
        super();
        this.state = {
            form: "recovery",
        };

        this.sendCode = this.sendCode.bind(this);
    }

    sendCode(event) {
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
            form = <SendCodeForm onSubmit={this.sendCode}/>
        }else{
            form = <Notify type="recovery" link="/main" text="На главную"/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}

