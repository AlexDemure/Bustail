import React from 'react';

import './css/transport.css'


export default class TransportNotification extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_covers[0].id}`
        } else {
            image_url = null
        }
        
        let footer;

        if (
            (this.props.notification_owner === "driver" && this.props.notification_type === "driver_to_client") || 
            (this.props.notification_owner === "client" && this.props.notification_type === "client_to_driver") 
        ) {
            footer = <p className="transport__notification__btn-remove-offer" onClick={this.props.removeOffer}>Отменить предложение</p>
        } else if (
            (this.props.notification_owner === "driver" && this.props.notification_type === "client_to_driver") || 
            (this.props.notification_owner === "client" && this.props.notification_type === "driver_to_client")
        ) {
            footer = 
            <React.Fragment>
                <p id="accept" className="transport__notification__btn-set-decision-offer accept" onClick={this.props.setOfferDecision}>Принять</p>
                <p id="reject" className="transport__notification__btn-set-decision-offer reject" onClick={this.props.setOfferDecision}>Отменить</p>
            </React.Fragment>
        }

        return (
            <div id={this.props.transport.id} className="transport__notification">
                <img 
                src={image_url}
                className="transport__notification__photo"
                onClick={this.props.showTransportCard}
                >
                </img>
                <div className="transport__notification__card">
                    <div className="transport__notification__card__title">
                        <p id="model">{this.props.transport.brand} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__notification__card__body">
                        <div id="info">
                            <p className="transport__notification__item">вместимость: <span>{this.props.transport.count_seats}</span></p>
                            <p className="transport__notification__item">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="transport__notification__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    
                    <div className="transport__notification__card__footer">
                        {footer}
                    </div>
                </div>
            </div>
        )
    }
}

