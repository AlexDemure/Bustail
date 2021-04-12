import React from 'react'

import "./css/ticket.css"

import OfferForm from '../../forms/offer/main'


export default class TicketSearch extends React.Component {
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
            <div className="ticket__search">
                <div id="left">
                    <p className="ticket__search__placeholder">откуда</p>
                    <p id='from' className="ticket__search__city">{this.props.ticket.from}</p>
                    <p className="ticket__search__details-btn" onClick={() => this.onClick("about")}>подробнее</p>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__search__placeholder">куда</p>
                        <p id="to" className="ticket__search__city">{this.props.ticket.to}</p>
                        <p className="ticket__search__type-app">{this.props.ticket.type_app}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__search__date">{this.props.ticket.date}</p>
                        <p className="ticket__search__price">{this.props.ticket.price}</p>
                        <div className="ticket__search__offer-btn" onClick={() => this.onClick("offer")}>
                            <p>Предложить</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="ticket__search__about">
                        <div className="ticket__search__about__close-btn" onClick={() => this.onClick("")}></div>
                        <div className="ticket__search__about__details">
                            <p className="ticket__search__about__item description">Комментарий к заказу: <span>{this.props.ticket.description}</span></p>
                        </div>
                    </div>
                    )   
                }
                { this.state.typeWindow === "offer" && (
                        <OfferForm
                        onClick={() => this.onClick("")}
                        offer_type="Предложение аренды"
                        create_link="/transport/create"
                        choices={this.props.choices}
                        />
                    )   
                }
            </div>
        )
    }
}
