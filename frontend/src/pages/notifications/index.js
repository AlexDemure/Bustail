import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import { aboutMe } from '../../components/common/api/about_me'
import { getDriverCard } from '../../components/common/api/driver_card'
import { getMeApps } from '../../components/common/api/me_apps'

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
            client_applications: null,
            driver: null,
            driver_applications: null
        };
        
        this.changeForm = this.changeForm.bind(this)
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
        
        let user = await aboutMe()
        let client_applications = await getMeApps()
        let driver = await getDriverCard()
        
        this.setState({
            user: user,
            client_applications: client_applications,
            driver: driver,
        })

        if (driver) {
            let driver_applications = await this.getDriverApps()
            this.setState({
                driver_applications: driver_applications
            })
        }
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
        let client_notifications;
        let driver_notifications;

        if (this.state.form === "client") {
            form = <ClientNotifications user={this.state.user} applications={this.state.client_applications}/>
        }else {
            form = <DriverNotifications applications={this.state.driver_applications}/>
        }

        if (this.state.client_applications) {
            client_notifications = this.state.client_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            client_notifications = client_notifications.reduce((a, b) => a + b, 0)
        }

        if (this.state.driver_applications) {
            driver_notifications = this.state.driver_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            driver_notifications = driver_notifications.reduce((a, b) => a + b, 0)
        }
       

        return (
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
        )
    }
}