import React from 'react'

import { getMeNotifications } from './api/me_notifications'

import './css/navbar.css'


class NavBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            count_notifications: this.props.count_notifications ?? 0
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.count_notifications !== this.props.count_notifications) {
            let notifications = await getMeNotifications()
            
            this.setState({
                count_notifications: notifications ? notifications.count_notifications : 0
            })
        }
    }
    async componentDidMount() {
        if (this.props.count_notifications) {
            this.setState({
                count_notifications: this.props.count_notifications
            })
            return
        }
        
        let notifications = await getMeNotifications()

        this.setState({
            count_notifications: notifications ? notifications.count_notifications : 0
        })

    }

    render() {
        
        return (
            <div className="navbar__common">
            <a href="/main" className="navbar__common__btn" id="home"></a>
            <a href="/history" className="navbar__common__btn" id="history"></a>
            <a href="/notifications" className="navbar__common__btn" id="notifications">
            
            {   
                this.state.count_notifications > 0 &&
                <div className="navbar__common__notification__circle">
                    <p>{this.state.count_notifications}</p>
                </div>
            }
            
            </a>
            <a href="/cabinet" className="navbar__common__btn" id="cabinet"></a>
        </div> 
        )
        
    }

}

export default NavBar