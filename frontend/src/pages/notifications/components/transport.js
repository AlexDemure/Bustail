import React from 'react';

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportNotification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
            error: null,
        }

        this.removeOffer = this.removeOffer.bind(this)
        this.setOfferDecision = this.setOfferDecision.bind(this)
    }

    removeOffer() {
        let data = {notification_id: this.props.notification_id}

        sendRequest('/api/v1/notifications/', "DELETE", data)
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

    setOfferDecision(e) {
        let data = {
            notification_id: this.props.notification_id,
            decision: e.target.id === "accept" ? true : false 
        }

        sendRequest('/api/v1/notifications/', "PUT", data)
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

    onClick(window) {
        this.setState({typeWindow: window})
    }

    render() {
        let image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_cover}`
        let footer;

        if (
            (this.props.owner === "driver" && this.props.notification_type === "driver_to_client") || 
            (this.props.owner === "client" && this.props.notification_type === "client_to_driver") 
        ) {
            footer = <p className="transport__notification__btn-remove-offer" onClick={this.removeOffer}>Отменить предложение</p>
        } else if (
            (this.props.owner === "driver" && this.props.notification_type === "client_to_driver") || 
            (this.props.owner === "client" && this.props.notification_type === "driver_to_client")
        ) {
            footer = 
            <React.Fragment>
                <p id="accept" className="transport__notification__btn-set-decision-offer accept" onClick={this.setOfferDecision}>Принять</p>
                <p id="reject" className="transport__notification__btn-set-decision-offer reject" onClick={this.setOfferDecision}>Отменить</p>
            </React.Fragment>
        }

        return (
            <div id={this.props.transport.id} className="transport__notification">
                <img 
                src={image_url}
                className="transport__notification__photo"
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

                { this.state.typeWindow === "transport_card" && (
                        <div className="transport__notification__about">
                            <div className="transport__notification__about__close-btn" onClick={() => this.setState({typeWindow: ""})}></div>
                            <div className="transport__notification__about__details">
                                <p className="transport__notification__about__item">Описание: <span>{this.props.transport.description}</span></p>
                            </div>
                        </div>
                    )   
                }

            </div>
        )
    }
}

