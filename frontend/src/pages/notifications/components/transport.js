import React from 'react';

import './css/transport.css'


export default class TransportNotification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
            transport: {
                id: null,
                transport_cover: null,
                brand: null,
                model: null,
                description: null,
            },
        }
    }


    onClick(window) {
        this.setState({typeWindow: window})
    }

    componentDidMount() {
        this.props.transport.then(
            (res) => {
                console.log(res)
                this.setState({
                    transport: res
                })
            }
        )
       
    }

    render() {
        let image_url = `/api/v1/drivers/transports/${this.state.transport.id}/covers/${this.state.transport.transport_cover}`
        let footer;

        if (
            (this.props.owner === "driver" && this.props.notification_type === "driver_to_client") || 
            (this.props.owner === "client" && this.props.notification_type === "client_to_driver") 
        ) {
            footer = <p className="transport__notification__btn-remove-offer" onClick={this.props.removeOffer}>Отменить предложение</p>
        } else if (
            (this.props.owner === "driver" && this.props.notification_type === "client_to_driver") || 
            (this.props.owner === "client" && this.props.notification_type === "driver_to_client")
        ) {
            footer = 
            <React.Fragment>
                <p id="accept" className="transport__notification__btn-set-decision-offer accept" onClick={this.props.setOfferDecision}>Принять</p>
                <p id="reject" className="transport__notification__btn-set-decision-offer reject" onClick={this.props.setOfferDecision}>Отменить</p>
            </React.Fragment>
        }

        return (
            <div id={this.state.transport.id} className="transport__notification">
                <img 
                src={image_url}
                className="transport__notification__photo"
                >
                </img>
                <div className="transport__notification__card">
                    <div className="transport__notification__card__title">
                        <p id="model">{this.state.transport.brand} {this.state.transport.model}</p>
                    </div>
                    <div className="transport__notification__card__body">
                        <div id="info">
                            <p className="transport__notification__item">вместимость: <span>{this.state.transport.count_seats}</span></p>
                            <p className="transport__notification__item">стоимость: <span>{this.state.transport.price}</span></p>
                            <p className="transport__notification__item">город: <span>{this.state.transport.city}</span></p>
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
                                <p className="transport__notification__about__item">Описание: <span>{this.state.transport.description}</span></p>
                            </div>
                        </div>
                    )   
                }

            </div>
        )
    }
}

