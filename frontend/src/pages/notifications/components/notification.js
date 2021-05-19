import React from 'react'

import Transport from '../../../components/cards/transport/index'

import TicketNotification from './ticket'


export default class Notification extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <React.Fragment>
                <div className="offer">
                    <TicketNotification ticket={this.props.notifiation.application}/>
                    <Transport
                    controls="notification"
                    transport={this.props.notifiation.transport}
                    notification_owner={this.props.notification_owner}
                    notification_type={this.props.notifiation.notification_type}
                    setOfferDecision={this.props.setOfferDecision}
                    removeOffer={this.props.removeOffer}
                    showTransportCard={this.props.showTransportCard} 
                    />
                </div>
               
            </React.Fragment>
        )
       
    }
} 