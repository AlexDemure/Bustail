import React from 'react'

import SubmitButton from '../../../components/common/buttons/submit_btn'

import { sendVerifyCode } from '../../../components/common/api/mailing/verify_code'

import CountDown from '../components/count_down'

import './css/new_send_msg.css'


export default class NewSendMessageForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seconds: 60
        }
        this.sendMessage = this.sendMessage.bind(this);
    }

    setTime = (seconds) => {
        // Bind не надо
        this.setState({
            seconds: seconds
        })
    }

    async sendMessage(event) {
        event.preventDefault();
        
        let response = await sendVerifyCode({email: this.props.email})
        if (response.result !== null) {
            this.setState({
                seconds: 60
            })
        }
    }

    render() {
        let { seconds } = this.state
        return (
            <form className="registration__form__new-send-msg" onSubmit={this.sendMessage}>
                { 
                   seconds !== 0 && 
                   <CountDown setTime={this.setTime} seconds={this.state.seconds}/>
                }
                <SubmitButton className={this.state.seconds !== 0 ? "no-active" : ""} value="Отправить код"/>
            </form>
        )
    }
}