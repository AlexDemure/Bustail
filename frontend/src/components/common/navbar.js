import React from 'react'

import { aboutMe } from './api/about_me'
import { getDriverCard } from './api/driver_card'
import { getMeApps } from './api/me_apps'

import sendRequest from '../../utils/fetch'

import './css/navbar.css'


class NavBar extends React.Component {
    constructor() {
        super()

        this.state = {
            user: null,
            client_applications: null,
            driver: null,
            driver_applications: null
        };
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

    render() {
        let notifications = 0

        if (this.state.client_applications) {
            let client_notifications = this.state.client_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            notifications += client_notifications.reduce((a, b) => a + b, 0)
        }

        if (this.state.driver_applications) {
            let driver_notifications = this.state.driver_applications.map(
                (ticket) => {return ticket.notifications.length} 
            )
            notifications += driver_notifications.reduce((a, b) => a + b, 0)
        }

        return (
            <div className="navbar__common">
            <a href="/main" className="navbar__common__btn" id="home">Home</a>
            <a href="/history" className="navbar__common__btn" id="history">History</a>
            <a href="/notifications" className="navbar__common__btn" id="notifications">
                { notifications > 0 && (
                    <div className="navbar__common__notification__circle">
                        <p>{notifications}</p>
                    </div>
                    )
                }
            </a>
            <a href="/cabinet" className="navbar__common__btn" id="cabinet">Cabinet</a>
        </div> 
        )
        
    }

}

export default NavBar