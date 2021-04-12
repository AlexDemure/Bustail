import React from 'react';

import './css/transport_offer.css'
import './css/base.css'


export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    
    }
    render() {
        return (
            <div className="transport__offer">
                <div className="transport__offer__photo" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
                <div className="transport__offer__card">
                    <div className="transport__offer__card__title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__offer__card__body">
                        <div id="info">
                            <p className="transport__offer__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__offer__card__footer">
                        <p>Предложить</p>
                    </div>
                </div>
                
                { this.state.typeWindow === "transport_card" && (
                    <div className="transport__offer__about">
                        <div className="transport__offer__about__close-btn" onClick={() => this.setState({typeWindow: ""})}></div>
                        <div className="transport__offer__about__details">
                            <p className="transport__offer__about__item">Описание: <span>{this.props.transport.description}</span></p>
                        </div>
                    </div>
                    )   
                }

            </div>
        )
    }
}

