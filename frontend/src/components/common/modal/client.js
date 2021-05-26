import React from 'react'

import { getAccountCard } from '../api/account/get_by_id'

import './css/base.css'
import './css/client.css'


export default class ClientCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            user: {
                fullname: null,
                phone: null,
                email: null,
            }
        }
    }

    async componentDidMount() {
        let user = await getAccountCard(this.props.account_id)
        this.setState({
            user: user.result
        })
    }

    render() {
       
        return(
            <div className="client-modal modal-window__bg">
                <div className="modal-window__content">
                    <p className="client__card__detail fullname">имя: <span>{this.state.user.fullname ? this.state.user.fullname : "Не указано"}</span></p>
                    <div className="modal-window__close-btn" onClick={this.props.onClose}></div>
                    <a href={"tel:"+ this.state.user.phone} className="client__card__detail phone"><div></div></a>
                    <p id="warning">Просим не распространять пользовательские данные иным лицам</p>
                </div>
            </div>
        )
       
    }
}