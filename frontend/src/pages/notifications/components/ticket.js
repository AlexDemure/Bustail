import React from 'react'

import "./css/ticket.css"


export default class TicketNotification extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let date_items = this.props.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`

        return (
                <div className="ticket__notification">
                <div id="left">
                    <p id='from' className="ticket__notification__city">{this.props.ticket.to_go_from}</p>
                    <p id="path"> > </p>
                    <p id="to" className="ticket__notification__city">{this.props.ticket.to_go_to}</p>
                </div>
                <div id="right">
                    <p className="ticket__notification__date">{new_date}</p>
                </div>
            </div>            
        )
    }
}
