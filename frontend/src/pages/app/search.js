import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import TransportCard from '../../components/common/modal/transport'
import Ticket from '../../components/common/cards/ticket/index'
import TicketCard from '../../components/common/modal/ticket'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { getMeDriverCard } from '../../components/common/api/drivers/me'
import { getMeAccountCard } from '../../components/common/api/account/me'
import { getMeCompanyCard } from '../../components/common/api/company/me'
import { appTypes } from '../../components/common/api/applications/types'
import { getCities } from '../../components/common/api/other/cities'
import {createNotification} from '../../components/common/api/notifications/create'
import {getApplications} from '../../components/common/api/applications/get'

import isAuth from '../../utils/is_auth'
import SerializeForm from '../../utils/form_serializer'

import OfferForm from "./components/offer"

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
            driver_transports: [],
            company_transports: [],

            cities: null,
            
            apps: null,
            total_rows: null,

            offset: null,
            application_type: null,
            city: null,
            order_by: null,
            order_type: null,
            
            isScrolling: true,

            transport_id: null,
            ticket_id: null,

            response_text: null,
            notify_type: null,
            error: null,

            application_types: null // Типы заявок для параметров поиска
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

    async createOffer(event, transport_id, price) {
        event.preventDefault();

        let data = {
            application_id: this.state.apps[this.state.offerData].id,
            transport_id: transport_id,
            notification_type: this.state.offer_type,
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
        
        if (e.target.scrollHeight - (e.target.offsetHeight + e.target.scrollTop) === 0) {
            if (this.state.isScrolling === true) {
                
                let response = await getApplications(this.state.city, this.state.application_type, this.state.offset);        

                let new_array = this.state.apps.concat(response.result.applications)
                        
                this.setState({
                    apps: new_array,
                    total_rows: response.result.total_rows,
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

        let application_types = [].slice.call(e.target.children[1].children)
        
        for (var key in application_types) {
            
            let class_items = application_types[key].className.split(" ")
            
            if (class_items[class_items.length - 1] === "active") {
                data.application_type += "application_type=" + class_items[class_items.length - 2] + "&"
                active_items.push(class_items[class_items.length - 2])
            }
        }
        
        let response = await getApplications(data.city, data.application_type);        

        this.setState({
            windowType: "search",
            active_items: active_items,

            apps: response.result.applications,
            total_rows: response.result.total_rows,
            offset: response.result.applications.length,
            
            application_type: data.application_type,
            city: data.city,

            isScrolling: true
        })

    }

    onSubmitSorted = async(e, order_by) => {
        document.getElementsByClassName('search-app__apps')[0].scrollTo(0, 0);

        let order_type = this.state.order_type;

        if (order_type === "desc") {
            order_type = "asc"
        } else if (order_type === "asc") {
            order_type = null
            order_by = null
        } else {
            order_type = "desc"
        }

        let response = await getApplications( 
            this.state.city || null,
            this.state.transport_type || null,
            0,
            order_by || "to_go_when",
            order_type || "asc"
        );        

        this.setState({
            apps: response.result.applications,
            total_rows: response.result.total_rows,
            offset: response.result.applications.length,
            
            order_by: order_by,
            order_type: order_type,

            isScrolling: true
        })

    }

    async componentDidMount(){

        let is_auth = isAuth(false)
        if (is_auth === true) {
            let user = await getMeAccountCard()
            let driver = await getMeDriverCard()
            let company = await getMeCompanyCard()

            this.setState({
                user: user.result,
                driver_transports: driver.result ? driver.result.transports : [],
                company_transports: company.result ? company.result.transports: [],

            })
        }
        
        let cities = await getCities()
        let apps_data = await getApplications()
        
        let application_types = await appTypes()

        this.setState({
            cities: cities.result,
            
            apps: apps_data.result.applications,
            total_rows: apps_data.result.total_rows,
            offset: apps_data.result ? apps_data.result.applications.length : null,

            application_types: application_types.result
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

                { this.state.offerData !== null && (
                        <OfferForm
                        closeOffer={() => this.setState({offerData: null})}
                        ticket={this.state.apps[this.state.offerData]}
                        offer_type="transport"
                        title="Предложение аренды"
                        create_link="/transport/create"
                        driver_transports={this.state.driver_transports}
                        company_transports={this.state.company_transports}
                        createOffer={this.createOffer}
                        showTransportCard={this.showTransportCard}
                        />
                    )   
                }

                {
                    this.state.windowType === "filters" &&
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
                    <div
                    onClick={(e) => this.onSubmitSorted(e, "price")}
                    className={`search-app__sort ${this.state.order_type && this.state.order_by === "price" ? this.state.order_type : ""}`}
                    ></div>
                    <div className="search-app__apps" onScroll={this.onScroll}>
                        {
                            this.state.apps &&
                            this.state.apps.map(
                                (ticket, index) => 
                                <Ticket
                                ticket={ticket}
                                controls="offer"
                                showTicketCard={() => this.showTicketCard(ticket.id)}
                                makeOffer={() => this.setState({offerData: index})}
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