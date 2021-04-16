import React from 'react';

import './css/transport.css'


export default class TransportNotification extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    }

    onClick(window) {
        this.setState({typeWindow: window})
    }

    render() {
        return (
            <div id={this.props.transport.id} className="transport__notification">
                <div className="transport__notification__photo"></div>
                <div className="transport__notification__card">
                    <div className="transport__notification__control reject" onClick={() => this.props.rejectOffer(this.props.transport.id)}></div>
                    <div className="transport__notification__card__title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__notification__card__body">
                        <div id="info">
                            <p className="transport__notification__item">вместимость: <span>{this.props.transport.seats}</span></p>
                            <p className="transport__notification__item">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="transport__notification__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__notification__card__controls">
                        <a href={"tel:"+ this.props.phone} className="transport__notification__control contacts"><div></div></a>
                        <div className="transport__notification__control info" onClick={() => this.onClick("transport_card")}></div>
                        <div className="transport__notification__control accept" onClick={() => this.onClick("accept")}></div>
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

