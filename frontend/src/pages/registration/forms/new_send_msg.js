import React from 'react'

import './css/new_send_msg.css'

import SubmitButton from '../../../components/common/buttons/submit_btn'
import CountDown from '../components/count_down'


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
        console.log(this.props.email);
        // TODO FETCH
        this.setState({
            seconds: 60
        })
    }

    render() {
        // BEST ФИЧА
        let { seconds } = this.state
        return (
            <form className="form_new_send_msg" onSubmit={this.sendMessage}>
                { 
                   seconds !== 0 && 
                   <CountDown setTime={this.setTime} seconds={this.state.seconds}/>
                }
                <SubmitButton className={this.state.seconds === 0 ? "active" : ""} value="Отправить код"/>
            </form>
        )
    }
}