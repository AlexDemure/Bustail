import React from 'react'

import { getAccountCard } from '../common/api/account/get_by_id'

import './css/client_card.css'

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
            <div className="client_card__modal-window__bg">
                <div className="client_card__modal-window__content">
                    <p className="client_card__modal-window__detail fullname">имя: <span>{this.state.user.fullname ? this.state.user.fullname : "Не указано"}</span></p>
                    <div className="client_card__modal-window__close-btn" onClick={this.props.onClose}></div>
                    <a href={"tel:"+ this.state.user.phone} className="client_card__modal-window__detail phone"><div></div></a>
                    <p id="warning">Просим не распространять пользовательские данные иным лицам</p>
                </div>
            </div>
        )
       
    }
}