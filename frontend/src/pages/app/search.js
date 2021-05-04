import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import TransportCard from '../../components/common/transport_card'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { getDriverCard } from '../../components/common/api/driver_card'
import { aboutMe } from '../../components/common/api/about_me'

import { getCities } from '../../constants/cities'
import { appTypes } from '../../constants/app_types'

import sendRequest from '../../utils/fetch'
import SerializeForm from '../../utils/form_serializer'

import OfferForm from "./components/offer"
import TicketSearch from './components/ticket'
import SearchFilters from './components/filters'


import './css/search.css'



export default class SearchAppPage extends React.Component {
    constructor() {
        super()

        this.state = {
            windowType: "search", // Окно переключаемое от параметров поиска к самому поиску
            active_items: [], // Список выбранных автомобилей в поиске

            offer_type: "driver_to_client",
            offerData: null,

            user: null,
            me_transports: [],
            cities: null,
            
            apps: null,
            total_rows: null,

            offset: null,
            application_type: null,
            city: null,
            
            isScrolling: true,

            transport_id: null,

            response_text: null,
            notify_type: null,
            error: null,

            application_types: null // Типы заявок для параметров поиска
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

    async getApps(city = null, application_type = null, offset = 0) {
        let data;
        
        let url = `/api/v1/applications/?limit=10&offset=${offset}&order_by=to_go_when&order_type=asc&`
        
        if (application_type !== null && application_type !== "") {
            url += application_type
        }

        if (city !== null && city !== "") {
            url += `city=${city}`
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
                
                let data = await this.getApps(this.state.city, this.state.application_type, this.state.offset);        

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
        let active_items = [];

        e.preventDefault()
        let prepared_data = SerializeForm(e.target, new FormData(e.target))
        
        let data = {
            city: prepared_data.get('city'),
            application_type: ""
        }

        let application_types = [].slice.call(e.target.children[2].children)
        
        for (var key in application_types) {
            
            let class_items = application_types[key].className.split(" ")
            
            if (class_items[class_items.length - 1] === "active") {
                data.application_type += "application_type=" + class_items[class_items.length - 2] + "&"
                active_items.push(class_items[class_items.length - 2])
            }
        }
        
        let response = await this.getApps(data.city, data.application_type);        

        this.setState({
            windowType: "search",
            active_items: active_items,

            apps: response.applications,
            total_rows: response.total_rows,
            offset: response.applications.length,
            city: data.city,
            
            application_type: data.application_type,
            city: data.city,
        })

    }

    async componentDidMount(){
        let user = await aboutMe()
        let driver = await getDriverCard()

        let cities = await getCities()
        let apps_data = await this.getApps()
        
        let application_types = await appTypes()

        this.setState({
            user: user,
            me_transports: driver ? driver.transports : [],
            cities: cities,
            
            apps: apps_data.applications,
            total_rows: apps_data.total_rows,
            offset: apps_data ? apps_data.applications.length : null,

            application_types: application_types
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

                {
                    this.state.windowType == "filters" &&
                    <SearchFilters
                    city={this.state.city !== null ? this.state.city : this.state.user.city}
                    active_items={this.state.active_items}
                    options={this.state.application_types}
                    onSubmit={(e) => this.onSubmit(e)}
                    closeFilters={() => this.setState({windowType: null})}
                    />
                }

                <Header previous_page="/main" page_name="Поиск заявки"/>

                <div className="container search-app">
                    <div className="search-app__filters" onClick={() => this.setState({windowType: "filters"})}></div>
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