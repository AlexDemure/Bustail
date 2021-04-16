import React from 'react'

import SubmitButton from '../../../components/common/buttons/submit_btn'

import CountDown from '../components/count_down'

import sendRequest from '../../../utils/fetch'

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

    sendMessage(event) {
        event.preventDefault();
        
        let data = {email: this.props.email}

        sendRequest('/api/v1/mailing/verify_code/', "POST", data, localStorage.getItem("token"))
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    seconds: 60
                })
            },
            (error) => {
                console.log(error.message);
            }
        )
    }

    render() {
        let { seconds } = this.state
        return (
            <form className="registration__form__new-send-msg" onSubmit={this.sendMessage}>
                { 
                   seconds !== 0 && 
                   <CountDown setTime={this.setTime} seconds={this.state.seconds}/>
                }
                <SubmitButton className={this.state.seconds === 0 ? "active" : ""} value="Отправить код"/>
            </form>
        )
    }
}