import React from 'react'

import "./css/ticket.css"


export default class TicketNotification extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let date_items = this.props.ticket.to_go_when.split("-")
        let new_date = `${date_items[2]}.${date_items[1]}`
        let price = this.props.new_price ? this.props.new_price : this.props.ticket.price
        let isChanged = this.props.new_price ? true : false
        return (
                <div className="ticket__notification">
                    
                    <div className="ticket__notification__direction">
                        <div className="ticket__notification__circle top" ></div>
                        <div className="ticket__notification__line"></div>
                        <div className="ticket__notification__circle bottom"></div>
                    </div>
                    
                    <p id='from' className="ticket__notification__city from">{this.props.ticket.to_go_from}</p>
                    <p id="to" className="ticket__notification__city to">{this.props.ticket.to_go_to}</p>
                
                    
                    <p className="ticket__notification__date">{new_date}</p>
                    <p className="ticket__notification__price">
                        <span>{`Цена: ${isChanged ? '(изм) ' : ""}`}</span>{price}
                    </p>
                
            </div>            
        )
    }
}
