import React from 'react'

import "./css/ticket.css"


export default class TicketOffer extends React.Component {
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
            <div className="ticket__offer">
                <div id="left">
                    <p className="ticket__offer__placeholder">откуда</p>
                    <p id='from' className="ticket__offer__city">{this.props.ticket.from}</p>
                    <p className="ticket__offer__details-btn" onClick={() => this.onClick("about")}>подробнее</p>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__offer__placeholder">куда</p>
                        <p id="to" className="ticket__offer__city">{this.props.ticket.to}</p>
                        <p className="ticket__offer__type-app">{this.props.ticket.type_app}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__offer__date">{this.props.ticket.date}</p>
                        <p className="ticket__offer__price">{this.props.ticket.price}</p>
                        <div className="ticket__offer__offer-btn" onClick={this.props.onClick}>
                            <p>Предложить</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="ticket__offer__about">
                        <div className="ticket__offer__about__close-btn" onClick={() => this.onClick("")}></div>
                        <div className="ticket__offer__about__details">
                            <p className="ticket__offer__about__item description">Комментарий к заказу: <span>{this.props.ticket.description}</span></p>
                        </div>
                    </div>
                    )   
                }
            </div>
        )
    }
}