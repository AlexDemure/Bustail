import React from 'react'

import { getMeNotifications } from './api/notifications/me'

import isAuth from '../../utils/is_auth'

import './css/navbar.css'


class NavBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            is_auth: null,
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
        
        let is_auth = isAuth(false)
        if (is_auth === true) {
            let notifications = await getMeNotifications()
            this.setState({
                count_notifications: notifications.result ?  notifications.result.count_notifications : 0
            })
        }

        this.setState({
            is_auth: is_auth
        })

    }

    render() {
        
        return (
            <div className="navbar__common">
            <a href="/main" className="navbar__common__btn" id="home"></a>
            <a href="/history" className={`navbar__common__btn ${this.state.is_auth ? '' : 'disable'} `} id="history"></a>
            <a href="/notifications" className={`navbar__common__btn ${this.state.is_auth ? '' : 'disable'} `} id="notifications">
            
            {   
                this.state.count_notifications > 0 &&
                <div className={`navbar__common__notification__circle ${this.state.is_auth ? '' : 'disable'} `}>
                    <p>{this.state.count_notifications}</p>
                </div>
            }
            
            </a>
            <a href="/cabinet" className={`navbar__common__btn ${this.state.is_auth ? '' : 'disable'} `} id="cabinet"></a>
        </div> 
        )
        
    }

}

export default NavBar