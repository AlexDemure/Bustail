import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/modal/transport'
import Transport from '../../components/common/cards/transport/index'
import TicketCard from '../../components/common/modal/ticket'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { getMeAccountCard } from '../../components/common/api/account/me'
import { getMeApps } from '../../components/common/api/applications/me'
import { transportTypes } from '../../components/common/api/transports/types'
import {createNotification} from '../../components/common/api/notifications/create'
import { getTransports } from '../../components/common/api/transports/get'

import SerializeForm from '../../utils/form_serializer'

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
            order_by: null,
            order_type: null,
            
            isScrolling: true,
            
            transport_id: null, // Карточка автомобиля
            ticket_id: null,

            transport_types: null // Типы автомобилей для параметров поиска
        }

        this.onScroll = this.onScroll.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmitSorted = this.onSubmitSorted.bind(this)
        this.createOffer = this.createOffer.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
        this.showTicketCard = this.showTicketCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    showTicketCard(ticket_id) {
        this.setState({
            ticket_id: ticket_id
        })
    }

    async createOffer(event, ticket_id, price) {
        event.preventDefault();


        let data = {
            application_id: ticket_id,
            transport_id: this.state.transports[this.state.offerData].id,
            notification_type: this.state.offer_type
        }

        if (price !== null && price !== 0) {
            data["price"] = price
        }

        let response = await createNotification(data)
        
        if (response.result !== null) {
            this.setState({
                response_text: "Предложение успешно отправлено",
                notify_type: "success",
                error: null,
                offerData: null
            })
            showNotify()
        
        } else {
            this.setState({
                response_text: response.error.message,
                notify_type: "error",
                error: response.error.message
            })
            showNotify()
        }
    }

    onScroll = async(e) => {
        
        if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) <= 100) {
            if (this.state.isScrolling === true) {
                
                let data = await getTransports(
                    this.state.city,
                    this.state.transport_type,
                    this.state.offset,
                    this.state.order_by || 'updated_at',
                    this.state.order_type || 'desc'
                );        

                let new_array = this.state.transports.concat(data.result.transports)
                        
                this.setState({
                    transports: new_array,
                    total_rows: data.result.total_rows,
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

        let response = await getTransports(data.city, data.transport_type);        

        this.setState({
            windowType: "search",
            active_items: active_items,

            transports: response.result.transports,
            total_rows: response.result.total_rows,
            offset: response.result.transports.length,
            transport_type: data.transport_type,
            city: data.city,
            isScrolling: true
        })

    }

    onSubmitSorted = async(e, order_by) => {
        document.getElementsByClassName('search-transport__transports')[0].scrollTo(0, 0);

        let order_type = this.state.order_type;

        if (order_type === "desc") {
            order_type = "asc"
        } else if (order_type === "asc") {
            order_type = null
            order_by = null
        } else {
            order_type = "desc"
        }

        let response = await getTransports(
            this.state.city || null,
            this.state.transport_type || null,
            0,
            order_by || "updated_at",
            order_type || "desc"
        );        

        this.setState({
            transports: response.result.transports,
            total_rows: response.result.total_rows,
            offset: response.result.transports.length,
            order_by: order_by,
            order_type: order_type,
            isScrolling: true
        })

    }

    async componentDidMount(){
        let user = await getMeAccountCard()
    
        let user_apps = await getMeApps()
        
        let transport_data = await getTransports()

        let transport_types = await transportTypes()

        this.setState({
            user: user.result,
            user_apps: user_apps.result.applications,
            transports: transport_data.result.transports,
            total_rows: transport_data.result.total_rows,
            offset: transport_data.result ? transport_data.result.transports.length : null,

            transport_types: transport_types.result
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
                    this.state.ticket_id && 
                    <TicketCard
                    ticket_id={this.state.ticket_id}
                    onClose={() => this.setState({ticket_id: null})}
                    />
                }

                { 
                    this.state.offerData !== null && 
                    <OfferForm
                    closeOffer={() => this.setState({offerData: null})}
                    offer_type="application"
                    title="Предложение заявки"
                    create_link="/app/create"
                    choices={this.state.user_apps}
                    createOffer={this.createOffer}
                    showTicketCard={this.showTicketCard}
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
                    <div
                    onClick={(e) => this.onSubmitSorted(e, "price")}
                    className={`search-transport__sort ${this.state.order_type && this.state.order_by === "price" ? this.state.order_type : ""}`}
                    ></div>
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
