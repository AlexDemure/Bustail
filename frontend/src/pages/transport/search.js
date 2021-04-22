import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'

import { aboutMe } from '../../components/common/api/about_me'
import { getCities } from '../../constants/cities'

import sendRequest from '../../utils/fetch'

import TransportSearch from './components/transport'
import TicketOffer from './components/ticket'

import './css/search.css'


export default class SearchTransportPage extends React.Component {
    constructor() {
        super()
        
        this.state = {
            user: null,
            user_apps: null,
            cities: null,
            transports: null,

            count_rows: 10,
            total_rows: null,
            isScrolling: true
        }

        this.onScroll = this.onScroll.bind(this)
    }
    
    async getMeApps() {
        let me_apps;
        await sendRequest('/api/v1/applications/client/', "GET")
        .then(
            (result) => {
                me_apps = result.applications
            },
            (error) => {
                console.log(error)
                me_apps = null
            }
        )
        return me_apps
    }

    async getTransports() {
        let data;
        await sendRequest(`/api/v1/drivers/transports/?limit=10&offset=0&order_by=id&order_type=asc`, "GET")
        .then(
            (result) => {
                data = {
                    transports: result.transports,
                    total_rows: result.total_rows
                }
            },
            (error) => {
                console.log(error)
                data = null
            }
        )
        return data
    }


    onScroll = (e) => {
        
        if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) === 0) {
            if (this.state.isScrolling === true) {
                sendRequest(`/api/v1/drivers/transports/?limit=10&offset=${this.state.count_rows}&order_by=id&order_type=asc`, "GET")
                .then(
                    (result) => {
                        let new_array = this.state.transports.concat(result.transports)
                        
                        this.setState({
                            transports: new_array,
                            count_rows: new_array.length
                        })

                        if (new_array.length >= this.state.total_rows) {
                            this.setState({
                                isScrolling: false
                            })
                        }
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            } 
        }
    }
      
    async componentDidMount(){
        let user = await aboutMe()
        let cities = await getCities()

        let user_apps = await this.getMeApps()
        user_apps = user_apps.map(
            (ticket) => <TicketOffer ticket={ticket}/>
        )

        let transport_data = await this.getTransports()

        this.setState({
            user: user,
            user_apps: user_apps,
            cities: cities,
            transports: transport_data.transports,
            total_rows: transport_data.total_rows,
        });
    }

    render() {
        return (
            <div className="container search-transport">
                <Header previous_page="/main" page_name="Поиск транспорта"/>
                <SearchInput options={this.state.cities}/>
                <div className="search-transport__transports" onScroll={this.onScroll}>
                    {
                        this.state.transports &&
                        this.state.transports.map(
                            (transport) => <TransportSearch choices={this.state.user_apps} transport={transport}/>
                        )
                    }
                </div>
                <NavBar/>
            </div>
        )
    }
    
}
