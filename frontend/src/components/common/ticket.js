import React from 'react'

import "./css/ticket.css"

export default class TicketItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    }
    render() {
        return (
            <div className="ticket">
                <div id="left">
                    <p className="annotation">откуда</p>
                    <p id='from' className="city">{this.props.ticket.from}</p>
                    <p className="about" onClick={() => this.setState({typeWindow: "about"})}>подробнее</p>
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
                        <div className="offer" onClick={this.props.onClick}>
                            <p>Предложить</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="about_card">
                        <div className="close_card" onClick={() => this.setState({typeWindow: ""})}></div>
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
