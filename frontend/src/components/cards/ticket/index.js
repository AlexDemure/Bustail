import React from 'react'

import './css/base.css'


function RejectBtn(props) {
    return (
        <div className="ticket__reject-btn" onClick={props.rejectApplication}>
            <p>Отменить</p>
        </div>
    )
}

function OfferBtn(props) {
    return (
        <div className="ticket__offer-btn" onClick={props.makeOffer}>
            <p>Предложить</p>
        </div>
    )
}

export default class Ticket extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let date_items = this.props.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`
        let controls;

        if (this.props.controls === "offer") {
            // Используется на страницах Поиск транспорта, Страницы компании
            controls = <OfferBtn makeOffer={this.props.makeOffer}/>
        
        } else if (this.props.controls === "reject") {
            // Используется В Личном кабинете
            controls = <RejectBtn rejectApplication={this.props.rejectApplication}/>
        }
        return (
            <div className="ticket">
                <div id="left">
                    <p className="ticket__placeholder">откуда</p>
                    <p id='from' className="ticket__city">{this.props.ticket.to_go_from}</p>
                    <p className="ticket__details-btn" onClick={() => this.props.showTicketCard(this.props.ticket.id)}>подробнее</p>
                    {
                        this.props.show_status === true &&
                        <div className={"ticket__status " + this.props.ticket.application_status}></div>
                    }
                    
                </div>
                <div id="right">
                    <div id="right-div-left">
                        <p className="ticket__placeholder">куда</p>
                        <p id="to" className="ticket__city">{this.props.ticket.to_go_to}</p>
                        <p className="ticket__type-app">{this.props.ticket.application_type}</p>
                    </div>
                    <div id="right-div-right">
                        <p className="ticket__date">{new_date}</p>
                        <p className="ticket__price">{this.props.ticket.price !== 0 ? this.props.ticket.price : "Не указано"}</p>
                        {controls}
                    </div>
                </div>
            </div>
        )
    }
}