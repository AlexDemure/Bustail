import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'
import Transport from '../../components/cards/transport/index'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { aboutMe } from '../../components/common/api/about_me'
import { getMeApps } from '../../components/common/api/me_apps'

import { transportTypes } from '../../constants/transport_types'

import SerializeForm from '../../utils/form_serializer'
import sendRequest from '../../utils/fetch'


import OfferForm from "./components/offer"
import SearchFilters from './components/filters'


import './css/search.css'


export default class SearchTransportPage extends React.Component {
    constructor() {
        super()
        
        this.state = {
            windowType: "search", // Окно переключаемое от параметров поиска к самому поиску
            active_items: [], // Список выбранных автомобилей в поиске

            offer_type: "client_to_driver",  // Окно переключаемое от предложения к самому поиску
            offerData: null,

            user: {
                city: null
            },

            user_apps: [],

            transports: null,
            total_rows: null,
            
            offset: null,
            transport_type: null, 
            city: null,
            
            isScrolling: true,
            
            transport_id: null, // Карточка автомобиля

            transport_types: null // Типы автомобилей для параметров поиска
        }

        this.onScroll = this.onScroll.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getTransports = this.getTransports.bind(this)
        this.createOffer = this.createOffer.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    createOffer(event, ticket_id, price) {
        event.preventDefault();


        let data = {
            application_id: ticket_id,
            transport_id: this.state.transports[this.state.offerData].id,
            notification_type: this.state.offer_type
        }

        if (price !== null && price !== 0) {
            data["price"] = price
        }

        sendRequest('/api/v1/notifications/', "POST", data)
        .then(
            (result) => {
                console.log(result)
                this.setState({
                    response_text: "Предложение успешно отправлено",
                    notify_type: "success",
                    error: null,
                    offerData: null
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

    async getTransports(city = null, transport_type = null, offset = 0) {
        let data;
        
        let url = `/api/v1/drivers/transports/?limit=10&offset=${offset}&order_by=id&order_type=desc&`
        
        if (transport_type !== null && transport_type !== "") {
            url += transport_type
        }

        if (city !== null && city !== "") {
            url += `city=${city}`
        }
        
        await sendRequest(url, "GET")
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

    onScroll = async(e) => {
        
        if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) === 0) {
            if (this.state.isScrolling === true) {
                
                let data = await this.getTransports(this.state.city, this.state.transport_type, this.state.offset);        

                let new_array = this.state.transports.concat(data.transports)
                        
                this.setState({
                    transports: new_array,
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
            transport_type: ""
        }

        let transport_types = [].slice.call(e.target.children[1].children)
        
        for (var key in transport_types) {
            
            let class_items = transport_types[key].className.split(" ")
            
            if (class_items[class_items.length - 1] === "active") {
                data.transport_type += "transport_type=" + class_items[class_items.length - 2] + "&"
                active_items.push(class_items[class_items.length - 2])
            }
        }

        let response = await this.getTransports(data.city, data.transport_type);        

        this.setState({
            windowType: "search",
            active_items: active_items,

            transports: response.transports,
            total_rows: response.total_rows,
            offset: response.transports.length,
            transport_type: data.transport_type,
            city: data.city,
        })

    }

    async componentDidMount(){
        let user = await aboutMe()
    
        let user_apps = await getMeApps()
        
        let transport_data = await this.getTransports()

        let transport_types = await transportTypes()

        this.setState({
            user: user,
            user_apps: user_apps,
            transports: transport_data.transports,
            total_rows: transport_data.total_rows,
            offset: transport_data ? transport_data.transports.length : null,

            transport_types: transport_types
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

                { 
                    this.state.offerData !== null && 
                    <OfferForm
                    closeOffer={() => this.setState({offerData: null})}
                    offer_type="Предложение заявки"
                    create_link="/app/create"
                    choices={this.state.user_apps}
                    createOffer={this.createOffer}
                    />  
                }
                
                {
                    this.state.windowType === "filters" &&
                    <SearchFilters
                    city={this.state.city !== null ? this.state.city : this.state.user.city}
                    active_items={this.state.active_items}
                    options={this.state.transport_types}
                    onSubmit={(e) => this.onSubmit(e)}
                    closeFilters={() => this.setState({windowType: null})}
                    />
                }
                

                <Header previous_page="/main" page_name="Поиск транспорта"/>

                <div className="container search-transport">
                    <div className="search-transport__filters" onClick={() => this.setState({windowType: "filters"})}></div>
                    <div className="search-transport__transports" onScroll={this.onScroll}>
                        {
                            this.state.transports &&
                            this.state.transports.map(
                                (transport, index) => 
                                <Transport
                                controls="multi"
                                transport={transport}
                                showTransportCard={() => this.showTransportCard(transport.id)}
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
