import React from 'react'

import TransportNotification from './transport'
import TicketNotification from './ticket'


export default class Notification extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <React.Fragment>
                <TicketNotification ticket={this.props.application}/>
                <TransportNotification
                transport={this.props.transport}
                notification_owner={this.props.notification_owner}
                notification_type={this.props.notification_type}
                setOfferDecision={this.props.setOfferDecision}
                removeOffer={this.props.removeOffer} 
                />
            </React.Fragment>
        )
       
    }
} 