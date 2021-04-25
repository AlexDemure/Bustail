import React from 'react'

import TicketNotification from '../components/ticket'

export default class DriverNotifications extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="notifications__driver__applications">
                {
                    this.props.applications &&
                    this.props.applications.map(
                        (ticket) => {
                            if (ticket.notifications.length > 0) {
                                return <TicketNotification owner="driver" ticket={ticket}/>
                            }
                        }
                        
                    )
                }
            </div>
        )
    }
}