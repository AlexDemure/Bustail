import React from 'react'

import NavBar from '../../../components/common/navbar'
import Header from '../../../components/common/header'
import CabinetSwitch from '../components/switch_cabinet'

import { aboutMe } from '../../../components/common/api/about_me'

import sendRequest from '../../../utils/fetch'

import TicketCabinet from '../components/ticket'

import './css/client.css'

export default class ClientPage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            user: null,
            applications: null
        }
    }

    async getMeApps() {
        let me_apps = [];
        await sendRequest('/api/v1/applications/client/', "GET")
        .then(
            (result) => {
                me_apps = result.applications
            },
            (error) => {
                console.log(error)
            }
        )
        return me_apps
    } 

    async componentDidMount(){
        let user = await aboutMe()
        let applications = await this.getMeApps()

        this.setState({
            user: user,
            applications: applications
        })
    }

    render() {
        return (
            <div className="container cabinet client">
                <Header previous_page="/main" page_name="Личный кабинет"/>
                <CabinetSwitch is_active="client" onClick={this.props.changeForm}/>
                <p id="warning">Сервис не несет ответственность за качество оказания услуг или спорных ситуаций при выполнении заказов.</p>
                <div className="cabinet__client__applications">
                    <p className="cabinet__client__title">Текущие заявки</p>
                    {
                        this.state.applications &&
                        this.state.applications.map(
                            (ticket) => <TicketCabinet ticket={ticket}/>
                        )
                    }
                </div>
                <NavBar/>
            </div>
        )
    }
}