import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'
import TicketCard from '../../components/common/ticket_card'
import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { getMeNotifications } from '../../components/common/api/notifications/me'
import { deleteNotification } from '../../components/common/api/notifications/delete'
import { updateNotification } from '../../components/common/api/notifications/update'

import isAuth from '../../utils/is_auth'

import NotificationSwitch from './components/notification_switch'
import Notification from './components/notification'


import './css/index.css'



export default class NotificationPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "client",

            notifications: null,

            response_text: null,
            notify_type: null,
            error: null,

            transport_id: null,
            ticket_id: null,
        };
        
        this.changeForm = this.changeForm.bind(this)
        this.removeOffer = this.removeOffer.bind(this)
        this.setOfferDecision = this.setOfferDecision.bind(this)
        this.deleteElementInArray = this.deleteElementInArray.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
        this.showTicketCard = this.showTicketCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    showTicketCard(ticket_id) {
        this.setState({
            ticket_id: ticket_id
        })
    }

    changeForm(event) {
        event.preventDefault();

        if (event.target.id === "driver") {
            this.setState({
                form: "driver",
            })
        } else {
            this.setState({
                form: "client",
            }) 
        }
    }

    deleteElementInArray(index_array) {
        let notifications = this.state.notifications;

        if (this.state.form === "client") {
            notifications.client.splice(index_array, 1)
        } else if (this.state.form === "driver") {
            notifications.driver.splice(index_array, 1)
        } else {
            return
        }

        notifications.count_notifications--;
        this.setState({
            notifications: notifications
        })
    }

    async removeOffer(notification_id, index_array) {
        let response = await deleteNotification(notification_id)
        
        if (response.result !== null) {
            this.deleteElementInArray(index_array)

            this.setState({
                response_text: "Заявка успешно удалена",
                notify_type: "success",
                error: null
            })
            
            showNotify()

        } else {
            this.setState({
                response_text: response.error.message,
                notify_type: "error",
                error: response.error.message
            })
            showNotify()
        }
    }

    async setOfferDecision(e, notification_id, index_array) {
        let data = {
            notification_id: notification_id,
            decision: e.target.id === "accept" ? true : false 
        }

        let response = await updateNotification(data)
        
        if (response.result !== null) {
            this.deleteElementInArray(index_array)

            this.setState({
                response_text: "Изменен статус по заявке",
                notify_type: "success",
                error: null
            })
            
            showNotify()

        } else {
            this.deleteElementInArray(index_array)
            
            this.setState({
                response_text: response.error.message,
                notify_type: "error",
                error: response.error.message
            })
            showNotify()
        }
    }

    async componentDidMount(){
        isAuth()
        
        let notifications = await getMeNotifications()

        this.setState({
            notifications: notifications.result
        })
    }

    render() {
        let notifications = [];
        let count_notifications = null;

        if (this.state.notifications) {
            count_notifications = this.state.notifications.count_notifications
            console.log(count_notifications)
            if (this.state.form === "client") {
                notifications = this.state.notifications.client
            } else if (this.state.form === "driver") {
                notifications = this.state.notifications.driver
            }
        }
       
        

        return (
            <React.Fragment>
                <ResponseNotify
                    notify_type={this.state.notify_type}
                    text={this.state.response_text}
                />

                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }

                {
                    this.state.ticket_id && 
                    <TicketCard
                    ticket_id={this.state.ticket_id}
                    onClose={() => this.setState({ticket_id: null})}
                    />
                }

                <Header previous_page="/main" page_name="Уведомления"/>

                <div className={"container notifications " + this.state.form}>
                    
                    <NotificationSwitch
                        is_active={this.state.form}
                        onClick={this.changeForm}
                        client_notifications={this.state.notifications && this.state.notifications.client.length > 0 ? this.state.notifications.client.length: null}
                        driver_notifications={this.state.notifications && this.state.notifications.driver.length > 0 ? this.state.notifications.driver.length: null}
                    />
                    <div className={`notifications__${this.state.form}__applications`}>
                        {
                            notifications.length > 0 &&
                            notifications.map(
                                (notification, index) => {
                                    return <Notification
                                            notification={notification}
                                            notification_owner={this.state.form}
                                            setOfferDecision={(e) => this.setOfferDecision(e, notification.id, index)}
                                            removeOffer={() => this.removeOffer(notification.id, index)}
                                            showTransportCard={() => this.showTransportCard(notification.transport.id)}
                                            showTicketCard={() => this.showTicketCard(notification.application.id)}
                                            />
                                }
                                
                            )
                        }
                    </div>
                    
                </div>

                <NavBar count_notifications={count_notifications}/>            
            </React.Fragment>
            
        )
    }
}