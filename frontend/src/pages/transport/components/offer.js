import React from 'react'

import sendRequest from '../../../utils/fetch'

import TicketOffer from './ticket'

import './css/offer.css'


export default class OfferForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            offer_type: "client_to_driver",
            error: null,
        }

        this.createOffer = this.createOffer.bind(this)
    }

    createOffer(event, ticket_id) {
        event.preventDefault();


        let data = {
            application_id: ticket_id,
            transport_id: this.props.transport_id,
            notification_type: this.state.offer_type
        }
        sendRequest('/api/v1/notifications/', "POST", data)
        .then(
            (result) => {
                console.log(result)
                this.setState({
                    error: null
                })
            },
            (error) => {
                console.log(error)
                this.setState({
                    error: error.message
                })
            }
        )
    }

    render() {
        return (
            <div className="offer__common__modal-window__bg">
                <div className="offer__common__modal-window__content">
                    <div>
                        <p className="offer__common__modal-window__title">{this.props.offer_type}</p>
                        <div className="offer__common__modal-window__close-btn" onClick={this.props.closeOffer}></div>
                    </div>
                    <div>
                        <p className="offer__common__modal-window__text">Выберите элемент из списка</p>
                        <a href={this.props.create_link} className="offer__common__modal-window__create-object">Создать</a>
                        {
                            this.state.error && 
                            <p className="offer__common__modal-window__text-error">{this.state.error}</p>
                        }
                    </div>
                    
                    <div className="offer__common__modal-window__choices">
                        {
                            this.props.choices.length > 0 ?
                            this.props.choices.map(
                                (choice) =>
                                <TicketOffer
                                createOffer={(e) => this.createOffer(e, choice.id)}
                                ticket={choice}/>
                            ) :
                            <p className="offer__common__modal-window__no-choices-text">Список предложений пуст</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}