import React from 'react'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import SubmitButton from '../../components/common/buttons/submit_btn'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import { aboutMe } from '../../components/common/api/about_me'

import { getCities } from '../../constants/cities'

import SerializeForm from '../../utils/form_serializer'
import sendRequest from '../../utils/fetch'

import TransportSearch from './components/transport'
import OfferForm from "./components/offer"


import './css/search.css'


export default class SearchTransportPage extends React.Component {
    constructor() {
        super()
        
        this.state = {
            offer_type: "client_to_driver",
            offerData: null,

            user: null,
            user_apps: [],
            cities: null,
            
            transports: null,
            total_rows: null,

            offset: null,
            city: null,
            
            isScrolling: true
            
        }

        this.onScroll = this.onScroll.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getTransports = this.getTransports.bind(this)
        this.createOffer = this.createOffer.bind(this)
    }

    createOffer(event, ticket_id) {
        event.preventDefault();


        let data = {
            application_id: ticket_id,
            transport_id: this.state.transports[this.state.offerData].id,
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

    async getMeApps() {
        let me_apps = [];
        await sendRequest('/api/v1/applications/client/', "GET")
        .then(
            (result) => {
                me_apps = result.applications
            },
            (error) => {
                console.log(error)
            }
        )
        return me_apps
    }

    async getTransports(city = null, offset = 0) {
        let data;
        
        let url = `/api/v1/drivers/transports/?limit=10&offset=${offset}&order_by=id&order_type=desc`
        if (city !== null && city !== "") {
            url += `&city=${city}`
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
                
                let data = await this.getTransports(this.state.city, this.state.offset);        

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
        e.preventDefault()
        let prepared_data = SerializeForm(e.target, new FormData(e.target))
        
        let data = await this.getTransports(prepared_data.get("city"));        

        this.setState({
            transports: data.transports,
            total_rows: data.total_rows,
            offset: data.transports.length,
            city: prepared_data.get("city"),
        })

    }

    async componentDidMount(){
        let user = await aboutMe()
        let cities = await getCities()

        let user_apps = await this.getMeApps()
        
        let transport_data = await this.getTransports()

        this.setState({
            user: user,
            user_apps: user_apps,
            cities: cities,
            transports: transport_data.transports,
            total_rows: transport_data.total_rows,
            offset: transport_data ? transport_data.transports.length : null,
        });
    }
    
    render() {
        return (
            <React.Fragment>
                {/* <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                /> */}
                <div className="container search-transport">
                    <Header previous_page="/main" page_name="Поиск транспорта"/>
                    <form className="search-transport__form__search" onSubmit={this.onSubmit} autoComplete="off">
                        <SearchInput name="city" options={this.state.cities} value={this.state.user ? this.state.user.city : null} isRequired={false}/>
                        <SubmitButton value="Поиск"/>
                    </form>
                    
                    <div className="search-transport__transports" onScroll={this.onScroll}>
                        {/* {
                            this.state.transports &&
                            this.state.transports.map(
                                (transport, index) => 
                                <TransportSearch
                                transport={transport}
                                openOffer={() => this.setState({offerData: index})}
                                />
                            )
                        } */}
                    </div>
                    { this.state.offerData !== null && (
                            <OfferForm
                            closeOffer={() => this.setState({offerData: null})}
                            offer_type="Предложение заявки"
                            create_link="/app/create"
                            choices={this.state.user_apps}
                            createOffer={this.createOffer}
                            />
                        )   
                    }
                </div>
                <NavBar/>
            </React.Fragment>
            
        )
    }
    
}
