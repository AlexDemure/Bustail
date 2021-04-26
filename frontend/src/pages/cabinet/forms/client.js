import React from 'react'

import NavBar from '../../../components/common/navbar'
import Header from '../../../components/common/header'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import { aboutMe } from '../../../components/common/api/about_me'
import { getMeApps } from '../../../components/common/api/me_apps'

import sendRequest from '../../../utils/fetch'

import CabinetSwitch from '../components/switch_cabinet'
import TicketCabinet from '../components/ticket'

import './css/client.css'

export default class ClientPage extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            user: null,
            applications: null,

            response_text: null,
            notify_type: null,
            error: null
        }

        this.rejectApplication = this.rejectApplication.bind(this)
    }

    rejectApplication(index_array) {
        sendRequest(`/api/v1/applications/${this.state.applications[index_array].id}/reject/`, "PUT")
        .then(
            (result) => {
                console.log(result)
                let applications = this.state.applications
                applications.splice(index_array, 1)

                this.setState({
                    applications: applications,

                    response_text: "Заявка успешно удалена",
                    notify_type: "success",
                    error: null
                })
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

    async componentDidMount(){
        let user = await aboutMe()
        let applications = await getMeApps()

        this.setState({
            user: user,
            applications: applications
        })
    }

    render() {
        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />
                <div className="container cabinet client">
                    <Header previous_page="/main" page_name="Личный кабинет"/>
                    <CabinetSwitch is_active="client" onClick={this.props.changeForm}/>
                    <p id="warning">Сервис не несет ответственность за качество оказания услуг или спорных ситуаций при выполнении заказов.</p>
                    <div className="cabinet__client__applications">
                        <p className="cabinet__client__title">Текущие заявки</p>
                        {
                            this.state.applications &&
                            this.state.applications.map(
                                (ticket, index) =>
                                <TicketCabinet
                                ticket={ticket}
                                rejectApplication={() => this.rejectApplication(index)}
                                />
                            )
                        }
                    </div>
                    <NavBar/>
                </div>
            </React.Fragment>
            
        )
    }
}