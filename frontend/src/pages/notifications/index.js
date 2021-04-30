import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'

import { getMeNotifications } from '../../components/common/api/me_notifications'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import isAuth from '../../utils/is_auth'
import sendRequest from '../../utils/fetch'

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

            transport_id: null
        };
        
        this.changeForm = this.changeForm.bind(this)
        this.removeOffer = this.removeOffer.bind(this)
        this.setOfferDecision = this.setOfferDecision.bind(this)
        this.deleteElementInArray = this.deleteElementInArray.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    deleteElementInArray(index_array) {
        let notifications = this.state.notifications;

        if (this.state.form == "client") {
            notifications.client.splice(index_array, 1)
        } else if (this.state.form == "driver") {
            notifications.driver.splice(index_array, 1)
        } else {
            return
        }

        notifications.count_notifications--;
        this.setState({
            notifications: notifications
        })
    }

    removeOffer(notification_id, index_array) {
        let data = {notification_id: notification_id}

        sendRequest('/api/v1/notifications/', "DELETE", data)
        .then(
            (result) => {
                console.log(result)

                this.deleteElementInArray(index_array)

                this.setState({
                    
                    response_text: "Заявка успешно удалена",
                    notify_type: "success",
                    error: null
                })
                
                showNotify()

            },
            (error) => {
                console.log(error)
                this.setState({
                    
                    response_text: error.message,
                    notify_type: "error",
                    error: error.message
                })
                showNotify()
            }
        )
    }

    setOfferDecision(e, notification_id, index_array) {
        let data = {
            notification_id: notification_id,
            decision: e.target.id === "accept" ? true : false 
        }

        sendRequest('/api/v1/notifications/', "PUT", data)
        .then(
            (result) => {
                console.log(result)

                this.deleteElementInArray(index_array)

                this.setState({
                    
                    response_text: "Изменен статус по заявке",
                    notify_type: "success",
                    error: null
                })
                
                showNotify()

            },
            (error) => {
                console.log(error)
                this.setState({
                    
                    response_text: error.message,
                    notify_type: "error",
                    error: error.message
                })
                showNotify()
            }
        )
    }


    async componentDidMount(){
        isAuth()
        
        let notifications = await getMeNotifications()

        this.setState({
            notifications: notifications
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

    render() {
        let notifications = [];
        let count_notifications = null;

        if (this.state.notifications) {
            count_notifications = this.state.notifications.count_notifications
            console.log(count_notifications)
            if (this.state.form == "client") {
                notifications = this.state.notifications.client
            } else if (this.state.form == "driver") {
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
                                            application={notification.application}
                                            transport={notification.transport}
                                            notification_owner={this.state.form}
                                            notification_type={notification.notification_type}
                                            setOfferDecision={(e) => this.setOfferDecision(e, notification.id, index)}
                                            removeOffer={() => this.removeOffer(notification.id, index)}
                                            showTransportCard={() => this.showTransportCard(notification.transport.id)}
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