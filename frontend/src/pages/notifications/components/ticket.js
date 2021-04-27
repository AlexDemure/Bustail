import React from 'react'

import { getTransportCard } from '../../../components/common/api/transport_card'

import TransportNotification from './transport'

import "./css/ticket.css"


export default class TicketNotification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: null,
            transports: null
        }
    }

    onClick(window) {
        if (this.state.typeWindow === "transports" && window === "transports") {
            this.setState({typeWindow: null})
        } else {
            this.setState({typeWindow: window})
        }
    }


    async componentDidMount() {
        let transports = [];
        let notification_transports = this.props.ticket.notifications.map(
            notification => {
                return {
                    transport_id: notification.transport_id,
                    notification_type: notification.notification_type,
                    notification_id: notification.id,
                } 
            }
        )
        
        for (var key in notification_transports) {
            let transport = await getTransportCard(notification_transports[key].transport_id)
            if (transport !== null) {
                transports.push({
                    transport: transport,
                    notification_type: notification_transports[key].notification_type,
                    notification_id: notification_transports[key].notification_id,
                })
            } 
        }

        this.setState({
            transports: transports
        })
    }
    render() {
        let date_items = this.props.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`

        return (
            <React.Fragment>
                <div className="ticket__notification">
                <div className="ticket__notification__control count_notifications">
                    <p>{this.props.ticket.notifications.length}</p>
                </div>
                <div id="left">
                    <p className="ticket__notification__placeholder">откуда</p>
                    <p id='from' className="ticket__notification__city">{this.props.ticket.to_go_from}</p>
                    <p className="ticket__notification__details-btn" onClick={() => this.onClick("about")}>подробнее</p>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__notification__placeholder">куда</p>
                        <p id="to" className="ticket__notification__city">{this.props.ticket.to_go_to}</p>
                        <p className="ticket__notification__type-app">{this.props.ticket.application_type}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__notification__date">{new_date}</p>
                        <p className="ticket__notification__price">{this.props.ticket.price !== 0 ? this.props.ticket.price : "Не указано"}</p>
                        <div className="ticket__notification__offer-btn" onClick={() => this.onClick("transports")}>
                            <p>Список</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="ticket__notification__about">
                        <div className="ticket__notification__about__close-btn" onClick={() => this.onClick("")}></div>
                        <div className="ticket__notification__about__details">
                            <p className="ticket__notification__about__item description">Комментарий к заказу: <span>{this.props.ticket.description}</span></p>
                        </div>
                    </div>
                    )   
                }
            </div>
            { this.state.typeWindow === "transports" && (
                    <div className="ticket__notification__transports">
                        {
                            this.state.transports &&
                            this.state.transports.map(
                                (transport_data, index) =>
                                 <TransportNotification
                                  ticket_id={this.props.ticket.id}
                                  owner={this.props.owner}
                                  notification_id={transport_data.notification_id}
                                  notification_type={transport_data.notification_type}
                                  transport={transport_data.transport}
                                />
                            )
                        }
                    </div>
                    )   
                }
            </React.Fragment>
            
        )
    }
}
