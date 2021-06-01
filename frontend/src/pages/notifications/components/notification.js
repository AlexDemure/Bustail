import React from 'react'

import './css/notification.css'


export default class Notification extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            application: this.props.notification.application,
            transport: this.props.notification.transport,
        }
    }

    render() {
        let image_url
        if (this.state.transport.transport_covers.length > 0) {
            image_url = this.state.transport.transport_covers[0].file_uri
        } else {
            image_url = '/default_cover.jpg'
        }

        let price = this.props.notification.price ? this.props.notification.price : this.state.application.price
        let isChanged = this.props.notification.price ? true : false

        let controls;
        if (
            (this.props.notification_owner === "driver" && this.props.notification.notification_type === "driver_to_client") || 
            (this.props.notification_owner === "client" && this.props.notification.notification_type === "client_to_driver") 
        ) {
            controls = <p className="notification__btn-remove-offer" onClick={this.props.removeOffer}>Отменить предложение</p>
        
        } else if (
            (this.props.notification_owner === "driver" && this.props.notification.notification_type === "client_to_driver") || 
            (this.props.notification_owner === "client" && this.props.notification.notification_type === "driver_to_client")
        ) {
            controls = 
            <React.Fragment>
                <p id="accept" className="notification__btn-set-decision-offer accept" onClick={this.props.setOfferDecision}>Принять</p>
                <p id="reject" className="notification__btn-set-decision-offer reject" onClick={this.props.setOfferDecision}>Отменить</p>
            </React.Fragment>
        }

    return (
        <React.Fragment>
            <div className="notification">
                <img 
                    src={image_url}
                    alt="preview"
                    className="notification__transport__photo"
                    onClick={this.props.showTransportCard}
                    >
                </img>
                <div className="notification__card__body">
                    <p 
                    onClick={this.props.showTransportCard}
                    className="notification__card__item transport_data">
                        <span>Транспорт: </span>{this.state.transport.brand} {this.state.transport.model}
                    </p>
                    <p 
                    onClick={this.props.showTicketCard}
                    className="notification__card__item ticket_data">
                        <span>Заявка: </span>{this.state.application.to_go_from} - {this.state.application.to_go_from}
                    </p>
                    <p className="notification__card__item price">
                        <span>{`Предложенная цена: ${isChanged ? "(изм)": ""}`} </span>{price > 0 ? price : "Не указано"}
                    </p>
                </div>
                <div className="notification__card__controls">
                    {controls}
                </div>
            </div>
            
        </React.Fragment>
        )
       
    }
} 
