import React from 'react'

import { getApplicationCard } from '../api/applications/get_by_id'

import './css/base.css'
import './css/ticket.css'


export default class TicketCard extends React.Component {
    constructor(props) {
        super(props) 
        this.state = {
            ticket: {
                to_go_when: '',
                to_go_from: null,
                to_go_to: null,
                description: null,
                application_type: null,
                count_seats: null
            }
        }
    }

    async componentDidMount() {
        let ticket = await getApplicationCard(this.props.ticket_id)
        this.setState({
            ticket: ticket.result
        })
    }

    render() {
        let date_items = this.state.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`
    
        return (
            <div className="ticket-modal modal-window__bg">
                <div className="modal-window__content">
                    <div>
                        <p className="modal-window__title">Карточка заявки</p>
                        <div className="modal-window__close-btn" onClick={this.props.onClose}></div>
                    </div>
                    <div className="ticket__card">
                        
                        <div className="ticket__card__direction">
                            <div className="ticket__card__circle top" ></div>
                            <div className="ticket__card__line"></div>
                            <div className="ticket__card__circle bottom"></div>
                        </div>
                        
                        <p id='from' className="ticket__card__detail from"><span>от </span>{this.state.ticket.to_go_from}</p>
                        <p id="to" className="ticket__card__detail to"><span>куда </span>{this.state.ticket.to_go_to}</p>

                        <div className="ticket__card__additionals">
                            <p className="ticket__card__detail date"><span>Дата: </span>{new_date}</p>
                            <p className="ticket__card__detail price">
                                <span>Цена: </span>{this.state.ticket.price > 0 ? this.state.ticket.price : "Не указано"}
                            </p>
                            <p className="ticket__card__detail app_type"><span>Тип: </span>{this.state.ticket.application_type}</p>
                            <p className="ticket__card__detail count_seats"><span>Пассажиров: </span>{this.state.ticket.count_seats}</p>
                        </div>
                        

                        <p className="ticket__card__detail description"><span>Описание </span>{this.state.ticket.description ? this.state.ticket.description : "Не указано"}</p>
                    </div>
                </div>
            </div>
        )
    }

}