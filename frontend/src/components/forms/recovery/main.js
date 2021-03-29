import React from 'react'

import '../css/base.css'

import Notify from '../../common/notify'
import DefaultInput from '../../common/inputs/default'
import SendFormBtn from '../../common/buttons/send_form_btn'

import SerializeForm from '../../../utils/form_serializer'


function SendCodeForm(props) {
    return (
        <div className="form">
            <form className="form_recovery" onSubmit={props.onSubmit}>
                <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
                <SendFormBtn value="Отправить код"/>
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

