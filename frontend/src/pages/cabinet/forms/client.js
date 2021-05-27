import React from 'react'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'
import Ticket from '../../../components/common/cards/ticket/index'
import TicketCard from '../../../components/common/modal/ticket'

import { rejectApplication } from '../../../components/common/api/applications/reject'

import CabinetSwitch from '../../../components/switches/cabinet'

import './css/client.css'


export default class ClientPage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            applications: props.applications,

            ticket_id: null,

            response_text: null,
            notify_type: null,
            error: null
        }

        this.rejectApplication = this.rejectApplication.bind(this)
        this.showTicketCard = this.showTicketCard.bind(this)
    }

    showTicketCard(ticket_id) {
        this.setState({
            ticket_id: ticket_id
        })
    }

    async rejectApplication(index_array) {
        let application = this.state.applications[index_array]
        
        let response = await rejectApplication(application.id)
        
        if (response.result !== null) {
            let applications = this.state.applications
                applications.splice(index_array, 1)

                this.setState({
                    applications: applications,

                    response_text: "Заявка успешно удалена",
                    notify_type: "success",
                    error: null
                })
                showNotify()
        
        } else {
            this.setState({
                error: response.error.message,
                response_text: response.error.message,
                notify_type: "error"
            })
            showNotify()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                applications: this.props.applications,
            })
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />
                
                {
                    this.state.ticket_id && 
                    <TicketCard
                    ticket_id={this.state.ticket_id}
                    onClose={() => this.setState({ticket_id: null})}
                    />
                }

                <div className="container cabinet client">
                    <CabinetSwitch is_active="client" onClick={this.props.changeForm}/>
                    <p id="warning">Заявки отображаются до подтверждения ее водителем, дальнейший статус заявки можно посмотреть на странице "История".</p>
                    <div className="cabinet__client__applications">
                        <p className="cabinet__client__title">Текущие заявки</p>
                        {
                            this.state.applications &&
                            this.state.applications.map(
                                (ticket, index) =>
                                <Ticket
                                controls="reject"
                                show_status={true}
                                ticket={ticket}
                                showTicketCard={() => this.showTicketCard(ticket.id)}
                                rejectApplication={() => this.rejectApplication(index)}
                                />
                            )
                        }
                    </div>
                </div>
            </React.Fragment>
            
        )
    }
}