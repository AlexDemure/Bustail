import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import Notify from '../../components/common/notify'

import { getMeDriverCard } from '../../components/common/api/drivers/me'
import { getMeCompanyCard } from '../../components/common/api/company/me'


import CreateTransportForm from './forms/create'

import './css/create.css'


export default class CreateTransportPage extends React.Component {
    constructor() {
        super()

        this.state = {
            page: null,
            driver: null,
            company: null
        }

        this.changePage = this.changePage.bind(this)
    }

    changePage(page) {
        this.setState({
            page: page
        })
    }

    async componentDidMount(){
        let company = await getMeCompanyCard()
        if (company.result !== null) {
            this.setState({
                company: company.result,
                page: "company"
            })
            return
        }

        let driver = await getMeDriverCard()
        if (driver.result !== null) {
            this.setState({
                driver: driver.result,
                page: "driver"
            })
            return
        }
        
        this.setState({
            page: "carrier_not_found"
        })
    }

    render() {
        let page;
       
        if (this.state.page === "notify") {
            page = <Notify type="create_transport" link="/cabinet" text="Личный кабинет"/>
        
        } else if (this.state.page === "carrier_not_found") {
            page = <Notify type="create_carrier" link="/cabinet" text="Личный кабинет"/>
        
        } else if (this.state.page === "driver") {
            page = <CreateTransportForm owner="driver" driver={this.state.driver} changePage={this.changePage}/>
        
        } else if (this.state.page === "company") {
            page = <CreateTransportForm owner="company" company={this.state.company} changePage={this.changePage}/>
        }
        
        return (
            <React.Fragment>
                <Header previous_page="/main" page_name="Предложение аренды"/>
                
                <div className={"container create-transport " + this.state.page}>
                    {page}
                </div>

                <NavBar/>
            </React.Fragment>
            
        )
       
    }
}
