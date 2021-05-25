import React from 'react'

import Header from '../../components/common/header'
import NavBar from '../../components/common/navbar'

import isAuth from '../../utils/is_auth'

import { getCities } from '../../components/common/api/other/cities'
import { getMeAccountCard } from '../../components/common/api/account/me'
import { getMeApps } from '../../components/common/api/applications/me'
import { getMeDriverCard } from '../../components/common/api/drivers/me'
import { getMeCompanyCard } from '../../components/common/api/company/me'

import CommonPage from './forms/common'
import ClientPage from './forms/client'
import DriverPage from './forms/driver'
import CompanyPage from './forms/company'

import './css/index.css'



export default class CabinetPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "common",
            
            cities: [],

            user: {
                email: null,
                city: null,
                phone: null,
                id: null,
            },
            user_applications: null,
            
            driver: null,
            driver_transports: null,

            company: null,
            company_transports: null,
        };

        this.changeForm = this.changeForm.bind(this)
        this.changeInfo = this.changeInfo.bind(this)
    }

    changeForm(event) {
        event.preventDefault();

        if (event.target.id === "common") {
            this.setState({
                form: "common",
            })
        } else if (event.target.id === "client"){
            this.setState({
                form: "client",
            }) 
        } else if (event.target.id === "driver") {
            this.setState({
                form: "driver",
            }) 
        } else {
            this.setState({
                form: "company",
            })
        }
    }

    changeInfo(user) {
        this.setState({
            user: {
                email: this.state.user.email,
                ...user
            }
        })
    }
    
    async componentDidMount(){
        isAuth()

        let user = await getMeAccountCard()
        let user_applications = await getMeApps()

        let cities = await getCities()

        this.setState({
            user: user.result,
            user_applications: user_applications.result.applications,

            cities: cities.result
        });

        let driver = await getMeDriverCard()
        if (driver.result) {
            this.setState({
                driver: driver.result,
                driver_transports: driver.result.transports,
            })
        }

        let company = await getMeCompanyCard()
        if (company.result) {
            this.setState({
                company: company.result,
                company_transports: company.result.transports
            })
        }

    }

    render() {
        let form;

        if (this.state.form === "common") {
            form = <CommonPage
            changeForm={this.changeForm}
            changeInfo={this.changeInfo}
            user={this.state.user}
            cities={this.state.cities}
            />
        } else if (this.state.form === "client") {
            form = <ClientPage
            changeForm={this.changeForm}
            applications={this.state.user_applications}
            />
        } else if (this.state.form === "driver") {
            form = <DriverPage
            changeForm={this.changeForm}
            driver={this.state.driver}
            transports={this.state.driver_transports}
            />
        } else if (this.state.form === "company") {
            form = <CompanyPage
            changeForm={this.changeForm}
            company={this.state.company}
            transports={this.state.company_transports}
            />
        }

        return (
            <React.Fragment>
                <Header previous_page="/main" page_name="Личный кабинет"/>
                {form}
                <NavBar/>
            </React.Fragment>
        )
    }
}