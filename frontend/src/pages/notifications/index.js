import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import { aboutMe } from '../../components/common/api/about_me'
import { getDriverCard } from '../../components/common/api/driver_card'
import { getMeApps } from '../../components/common/api/me_apps'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import isAuth from '../../utils/is_auth'
import sendRequest from '../../utils/fetch'

import NotificationSwitch from './components/notification'

import ClientNotifications from './forms/client'
import DriverNotifications from './forms/driver'


import './css/index.css'


export default class NotificationPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "client",

            user: null,
            driver: null,

            client_applications: [],
            driver_applications: [],

            response_text: null,
            notify_type: null,
            error: null
        };
        
        this.changeForm = this.changeForm.bind(this)
        this.removeOffer = this.removeOffer.bind(this)
        this.setOfferDecision = this.setOfferDecision.bind(this)
    }

    removeOffer(application_id, notification_id, owner, index) {
        let data = {notification_id: notification_id}

        sendRequest('/api/v1/notifications/', "DELETE", data)
        .then(
            (result) => {
                console.log(result)
                
                let applications = [];

                if (owner == "driver") {
                    applications = this.state.driver_applications
                } else if (owner == "client") {
                    applications = this.state.client_applications
                }
                
                applications.map(
                    (application) => {
                            if (application.id === application_id) {
                                let notifications = application.notifications
                                notifications.splice(index, 1)
                            }
                            return application
                        } 
                )

                if (owner == "driver") {
                    this.setState({
                        driver_applications: applications,

                        response_text: "Заявка успешно удалена",
                        notify_type: "success",
                        error: null
                    })

                } else if (owner == "client") {
                    this.setState({
                        client_applications: applications,

                        response_text: "Заявка успешно удалена",
                        notify_type: "success",
                        error: null
                    })
                }
                showNotify()

            },
            (error) => {
                console.log(error)
                this.setState({
                    error: error.message
                }) 
            }
        )
    }

    setOfferDecision(e, application_id, notification_id, owner, index) {
        let data = {
            notification_id: notification_id,
            decision: e.target.id === "accept" ? true : false 
        }

        sendRequest('/api/v1/notifications/', "PUT", data)
        .then(
            (result) => {
                let applications = [];

                if (owner == "driver") {
                    applications = this.state.driver_applications
                } else if (owner == "client") {
                    applications = this.state.client_applications
                }
                
                applications.map(
                    (application) => {
                            if (application.id === application_id) {
                                let notifications = application.notifications
                                notifications.splice(index, 1)
                            }
                            return application
                        } 
                )

                if (owner == "driver") {
                    this.setState({
                        driver_applications: applications,

                        response_text: "Заявка успешно удалена",
                        notify_type: "success",
                        error: null
                    })

                } else if (owner == "client") {
                    this.setState({
                        client_applications: applications,

                        response_text: "Заявка успешно удалена",
                        notify_type: "success",
                        error: null
                    })
                }
                showNotify()

            },
            (error) => {
                console.log(error)
                this.setState({
                    error: error.message,
                    response_text: error.message,
                    notify_type: "error"
                })
                showNotify()
            }
        )
    }

    async getDriverApps() {
        let driver_apps = [];
        await sendRequest('/api/v1/applications/driver/', "GET")
        .then(
            (result) => {
                driver_apps = result.applications
            },
            (error) => {
                console.log(error)
            }
        )
        return driver_apps
    }

    async componentDidMount(){
        isAuth()
        
        // Получение пользовательских данных
        let user = await aboutMe()
        let client_applications = await getMeApps()
        let driver = await getDriverCard()
        
        let driver_applications;
        if (driver) {
            driver_applications = await this.getDriverApps()
        }

        this.setState({
            // Данные пользователя
            user: user,
            driver: driver,

            // Заявки и предложения пользователя
            client_applications: client_applications,
            driver_applications: driver_applications
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
        let form;
        let {client_applications, driver_applications} = this.state;
        let client_notifications, driver_notifications = 0

        if (this.state.form === "client") {
            form = 
            <ClientNotifications
            setOfferDecision={this.setOfferDecision}
            removeOffer={this.removeOffer}
            applications={client_applications}
            />
        } else {
            form =
            <DriverNotifications
            setOfferDecision={this.setOfferDecision}
            removeOffer={this.removeOffer}
            applications={driver_applications}
            />
        }

        if (client_applications) {
            client_notifications = client_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            client_notifications = client_notifications.reduce((a, b) => a + b, 0)
        }

        if (driver_applications) {
            driver_notifications = driver_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            driver_notifications = driver_notifications.reduce((a, b) => a + b, 0)
        }
       

        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}/>
                <div className={"container notifications " + this.state.form}>
                    <Header previous_page="/main" page_name="Уведомления"/>
                    <NotificationSwitch
                    is_active={this.state.form}
                    onClick={this.changeForm}
                    client_notifications={client_notifications > 0 ? client_notifications: null}
                    driver_notifications={driver_notifications > 0 ? driver_notifications: null}
                    />
                    {form}
                    <NavBar/>
                </div>
            </React.Fragment>
            
        )
    }
}