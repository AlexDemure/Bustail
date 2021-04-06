import React from 'react'

import "./css/ticket.css"
import "./css/ticket_notification.css"


export default class TicketItem extends React.Component {
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
            <div className="ticket">
                <div className="control_icon" id="reject"></div>
                <div id="left">
                    <p className="annotation">откуда</p>
                    <p id='from' className="city">{this.props.ticket.from}</p>
                    <p className="about" onClick={() => this.onClick("about")}>подробнее</p>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="annotation">куда</p>
                        <p id="to" className="city">{this.props.ticket.to}</p>
                        <p className="app_type">{this.props.ticket.type_app}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="date">{this.props.ticket.date}</p>
                        <p className="price">{this.props.ticket.price}</p>
                        <div className="offer-btn" onClick={this.props.onClick}>
                            <p>Принять</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="about_card">
                        <div className="close_card" onClick={() => this.onClick("")}></div>
                        <div className="card_data">
                            <p className="description">Комментарий к заказу: <span>{this.props.ticket.description}</span></p>
                        </div>
                    </div>
                    )   
                }
            </div>
        )
    }
}
