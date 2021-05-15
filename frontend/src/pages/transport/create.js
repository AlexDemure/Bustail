import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import Notify from '../../components/common/notify'

import { getDriverCard } from '../../components/common/api/driver_card'
import { getMeCompanyCard } from '../../components/common/api/company_card'


import CreateTransportForm from './forms/create'

import './css/create.css'


function ChoiceOwner(props) {
    return (
        <div className="create-transport__choice-owner">
            <p id="driver" onClick={props.choiceOwner}>Личный транспорт</p>
            <p id="company" onClick={props.choiceOwner}>Транспорт компании</p>
        </div>
    )
}

export default class CreateTransportPage extends React.Component {
    constructor() {
        super()

        this.state = {
            page: "choice",
            owner: null,
            driver: null,
            company: null
        }

        this.changePage = this.changePage.bind(this)
        this.choiceOwner = this.choiceOwner.bind(this)
    }

    changePage(page) {
        this.setState({
            page: page
        })
    }

    choiceOwner(e) {
        if (e.target.id === "driver") {
            this.setState({
                owner: "driver",
            })
        } else if (e.target.id === "company"){
            this.setState({
                owner: "company",
            }) 
        }
    }

    async componentDidMount(){
        let driver = await getDriverCard()
        let company = await getMeCompanyCard()

        this.setState({
            driver: driver,
            company: company
        })
        
    }

    render() {
        let page;
        if (this.state.page === "choice" && this.state.owner === null) {
            page = <ChoiceOwner choiceOwner={(e) => this.choiceOwner(e)}/>
        
        } else if (this.state.page === "notify") {
            page = <Notify type="create_transport" link="/cabinet" text="Личный кабинет"/>
        
        } else if (this.state.owner !== null) {
           
            if (this.state.owner === "driver") {
                
                if (this.state.driver !== null) {
                    page = <CreateTransportForm owner={this.state.owner} driver={this.state.driver} changePage={this.changePage}/>
                
                } else {
                    page = <Notify type="create_driver" link="/cabinet" text="Личный кабинет"/>
                }
            }

            if (this.state.owner === "company") {
                
                if (this.state.company !== null) {
                    page = <CreateTransportForm owner={this.state.owner} company={this.state.company} changePage={this.changePage}/>
                
                } else {
                    page = <Notify type="create_company" link="/cabinet" text="Личный кабинет"/>
                }
            }

    
        } else if (this.state.page === "notify") {
            page = <Notify type="create_transport" link="/cabinet" text="Личный кабинет"/>
        
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
