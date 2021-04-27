import React from 'react'

import TicketNotification from '../components/ticket'


export default class ClientNotifications extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="notifications__client__applications">
                {
                    this.props.applications.length > 0 &&
                    this.props.applications.map(
                        (ticket) => {
                            if (ticket.notifications.length > 0) {
                                return <TicketNotification
                                        owner="client"
                                        ticket={ticket}
                                        setOfferDecision={this.props.setOfferDecision}
                                        removeOffer={this.props.removeOffer}
                                        />
                            }
                        }
                        
                    )
                }
            </div>
        )
    }
}