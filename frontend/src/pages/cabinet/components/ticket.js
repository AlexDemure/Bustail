import React from 'react'

import "./css/ticket.css"


export default class TicketCabinet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: ""
        }
    }

    onClick(window) {
        this.setState({typeWindow: window})
    }

    render() {
        let date_items = this.props.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`

        return (
            <div className="ticket__cabinet">
                <div id="left">
                    <p className="ticket__cabinet__placeholder">откуда</p>
                    <p id='from' className="ticket__cabinet__city">{this.props.ticket.to_go_from}</p>
                    <p className="ticket__cabinet__details-btn" onClick={() => this.onClick("about")}>подробнее</p>
                    <div className={"ticket__cabinet__status " + this.props.ticket.application_status}></div>
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__cabinet__placeholder">куда</p>
                        <p id="to" className="ticket__cabinet__city">{this.props.ticket.to_go_to}</p>
                        <p className="ticket__cabinet__type-app">{this.props.ticket.application_type}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__cabinet__date">{new_date}</p>
                        <p className="ticket__cabinet__price">{this.props.ticket.price}</p>
                        <div className="ticket__cabinet__reject-btn" onClick={this.props.rejectApplication}>
                            <p>Отменить</p>
                        </div>
                    </div>
                </div>
                { this.state.typeWindow === "about" && (
                    <div className="ticket__cabinet__about">
                        <div className="ticket__cabinet__about__close-btn" onClick={() => this.onClick("")}></div>
                        <div className="ticket__cabinet__about__details">
                            <p className="ticket__cabinet__about__item description">Комментарий к заказу: <span>{this.props.ticket.description}</span></p>
                        </div>
                    </div>
                    )   
                }
            </div>
        )
    }
}
