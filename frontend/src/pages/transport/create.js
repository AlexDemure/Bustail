import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import Notify from '../../components/common/notify'

import { getDriverCard } from '../../components/common/api/driver_card'

import sendRequest from '../../utils/fetch'

import CreateTransportForm from './forms/create'

import './css/create.css'


export default class CreateTransportPage extends React.Component {
    constructor() {
        super()

        this.state = {
            page: null,
            driver: null
        }
    }

    aboutMe() {
        sendRequest('/api/v1/drivers/me/', "GET")
        .then(
            (result) => {
                this.setState({
                    page: "create",
                    driver: {
                        account_id: result.account_id,
                        id: result.id
                    }
                })
            },
            (error) => {
                console.log(error.message);
            }
        )
    }

    changePage(page) {
        this.setState({
            page: page
        })
    }

    async componentDidMount(){
        let driver = await getDriverCard()
        if (driver) {
            this.setState({
                page: "create",
                driver: driver
            })
        }
    }

    render() {
        let page;
        if (this.state.page === null) {
            page = <Notify type="create_driver" link="/cabinet" text="Личный кабинет"/>
        
        } else if (this.state.page === "notify") {
            page = <Notify type="create_transport" link="/cabinet" text="Личный кабинет"/>
        
        } else if (this.state.page === "create") {
            page = <CreateTransportForm changePage={this.changePage.bind(this)}/>
        }
        
        return (
            <div className={"container create-transport " + this.state.page}>
                <Header previous_page="/main" page_name="Предложение аренды"/>
                {page}
                <NavBar/>
            </div>
        )
       
    }
}
