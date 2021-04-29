import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import SubmitButton from '../../components/common/buttons/submit_btn'
import TransportCard from '../../components/common/transport_card'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { getDriverCard } from '../../components/common/api/driver_card'
import { aboutMe } from '../../components/common/api/about_me'
import { getCities } from '../../constants/cities'

import sendRequest from '../../utils/fetch'
import SerializeForm from '../../utils/form_serializer'

import OfferForm from "./components/offer"
import TicketSearch from './components/ticket'


import './css/search.css'



export default class SearchAppPage extends React.Component {
    constructor() {
        super()

        this.state = {
            offer_type: "driver_to_client",
            offerData: null,

            user: null,
            me_transports: [],
            cities: null,
            
            apps: null,
            total_rows: null,

            offset: null,
            city: null,
            
            isScrolling: true,

            transport_id: null,

            response_text: null,
            notify_type: null,
            error: null
        }

        this.onScroll = this.onScroll.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getApps = this.getApps.bind(this)
        this.createOffer = this.createOffer.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    createOffer(event, transport_id) {
        event.preventDefault();

        let data = {
            application_id: this.state.apps[this.state.offerData].id,
            transport_id: transport_id,
            notification_type: this.state.offer_type
        }
        sendRequest('/api/v1/notifications/', "POST", data)
        .then(
            (result) => {
                console.log(result)
                this.setState({
                    response_text: "Предложение успешно отправлено",
                    notify_type: "success",
                    error: null
                })
                showNotify()
            },
            (error) => {
                console.log(error)
                this.setState({
                    response_text: error.message,
                    notify_type: "error",
                    error: error.message
                })
                showNotify()
            }
        )
    }

    async getApps(city = null, offset = 0) {
        let data;
        
        let url = `/api/v1/applications/?limit=10&offset=${offset}&order_by=to_go_when&order_type=asc`
        if (city !== null && city !== "") {
            url += `&city=${city}`
        }
        
        await sendRequest(url, "GET")
        .then(
            (result) => {
                data = {
                    applications: result.applications,
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

    onScroll = async(e) => {
        
        if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) === 0) {
            if (this.state.isScrolling === true) {
                
                let data = await this.getApps(this.state.city, this.state.offset);        

                let new_array = this.state.apps.concat(data.applications)
                        
                this.setState({
                    apps: new_array,
                    total_rows: data.total_rows,
                    offset: new_array.length
                })

                if (new_array.length >= this.state.total_rows) {
                    this.setState({
                        isScrolling: false
                    })
                }
        
            } 
        }
    }
    
    onSubmit = async(e) => {
        e.preventDefault()
        let prepared_data = SerializeForm(e.target, new FormData(e.target))
        
        let data = await this.getApps(prepared_data.get("city"));        

        this.setState({
            apps: data.applications,
            total_rows: data.total_rows,
            offset: data.applications.length,
            city: prepared_data.get("city"),
        })

    }

    async componentDidMount(){
        let user = await aboutMe()
        let driver = await getDriverCard()

        let cities = await getCities()
        let apps_data = await this.getApps()

        this.setState({
            user: user,
            me_transports: driver ? driver.transports : [],
            cities: cities,
            
            apps: apps_data.applications,
            total_rows: apps_data.total_rows,
            offset: apps_data ? apps_data.applications.length : null,
        });
    }

    render() {
        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />
                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }

                { this.state.offerData !== null && (
                        <OfferForm
                        closeOffer={() => this.setState({offerData: null})}
                        offer_type="Предложение аренды"
                        create_link="/transport/create"
                        choices={this.state.me_transports}
                        createOffer={this.createOffer}
                        showTransportCard={this.showTransportCard}
                        />
                    )   
                }

                <Header previous_page="/main" page_name="Поиск заявки"/>

                <div className="container search-app">
                    <form className="search-app__form__search" onSubmit={this.onSubmit} autoComplete="off">
                        <SearchInput name="city" options={this.state.cities} value={this.state.user ? this.state.user.city : null} isRequired={false}/>
                        <SubmitButton value="Поиск"/>
                    </form>
                    <div className="search-app__apps" onScroll={this.onScroll}>
                        {
                            this.state.apps &&
                            this.state.apps.map(
                                (ticket, index) => 
                                <TicketSearch
                                ticket={ticket}
                                openOffer={() => this.setState({offerData: index})}
                                />
                            )
                        }
                    </div>
                </div>
                
                <NavBar/>

            </React.Fragment>
           
        )
    }
    
}