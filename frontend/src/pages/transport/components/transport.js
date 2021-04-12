import React from 'react';

import OfferForm from "../../forms/offer/main"

import './css/transport.css'


export default class TransportSearch extends React.Component {
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
            <div className="transport__search">
                <div className="transport__search__photo"></div>
                <div className="transport__search__card">
                    <div className="transport__search__card__title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__search__card__body">
                        <div id="info">
                            <p className="transport__search__item">вместимость: <span>{this.props.transport.seats}</span></p>
                            <p className="transport__search__item">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="transport__search__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__search__card__controls">
                        <a href={"tel:"+ this.props.phone} className="transport__search__control contacts"><div></div></a>
                        <div className="transport__search__control info" onClick={() => this.onClick("transport_card")}></div>
                        <div className="transport__search__control offer" onClick={() => this.onClick("offer")}></div>
                    </div>
                </div>
                
                
                { this.state.typeWindow === "transport_card" && (
                        <div className="transport__search__about">
                            <div className="transport__search__about__close-btn" onClick={() => this.setState({typeWindow: ""})}></div>
                            <div className="transport__search__about__details">
                                <p className="transport__search__about__item">Описание: <span>{this.props.transport.description}</span></p>
                            </div>
                        </div>
                    )   
                }
                { this.state.typeWindow === "offer" && (
                        <OfferForm
                        onClick={() => this.onClick("")}
                        offer_type="Предложение заявки"
                        create_link="/app/create"
                        choices={this.props.choices}
                        />
                    )   
                }

            </div>
        )
    }
}

