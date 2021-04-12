import React from 'react'

import "./css/ticket.css"


export default class TicketNotification extends React.Component {
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
            <div className="ticket__notification">
                <div className="ticket__notification__control reject"></div>
                <div id="left">
                    <p className="ticket__notification__placeholder">откуда</p>
                    <p id='from' className="ticket__notification__city">{this.props.ticket.from}</p>
                    <p className="ticket__notification__details-btn" onClick={() => this.onClick("about")}>подробнее</p>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__notification__placeholder">куда</p>
                        <p id="to" className="ticket__notification__city">{this.props.ticket.to}</p>
                        <p className="ticket__notification__type-app">{this.props.ticket.type_app}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__notification__date">{this.props.ticket.date}</p>
                        <p className="ticket__notification__price">{this.props.ticket.price}</p>
                        <div className="ticket__notification__offer-btn" onClick={this.props.onClick}>
                            <p>Принять</p>
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
        )
    }
}
