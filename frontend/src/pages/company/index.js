import React from 'react'
import { withRouter } from 'react-router'
import { getCompanyCardByUrl } from '../../components/common/api/company_card'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'

import { getMeApps } from '../../components/common/api/me_apps'

import { ResponseNotify, showNotify } from '../../components/common/response_notify'

import sendRequest from '../../utils/fetch'

import TransportCompany from './components/transport'
import OfferForm from "./components/offer"

import './css/index.css'

class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offer_type: "client_to_driver",  // Окно переключаемое от предложения к самому поиску
            user_apps: [],

            company: {
                company_name: null,
                page_url: null,
                transports: null,
                socials: {
                    vk: null,
                    instagram: null
                }
            },
            
            offerData: null,
            
            notify_type: null,
            response_text: null,
            error: null,

            transport_id: null
        }

        this.createOffer = this.createOffer.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    async componentDidMount() {
        let company = await getCompanyCardByUrl(this.props.match.params.page_url)
        
        let user_apps = await getMeApps()

        this.setState({
            company: company,
            user_apps: user_apps
        })
    }

    
    createOffer(event, ticket_id, price) {
        event.preventDefault();


        let data = {
            application_id: ticket_id,
            transport_id: this.state.company.transports[this.state.offerData].id,
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

    render() {
        console.warn(this.props);
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

                <Header previous_page="/main" page_name="Страница компании"/>

                <div className="container company-page">
                    
                    <div className="company-page__title">
                        <p id="company-name">{this.state.company.company_name}</p>
                        <div className="company-page__socials">
                            <a href={`${this.state.company.socials.vk || '#'}`} id="vk"></a>
                            <a href={`${this.state.company.socials.instagram || '#'}`} id="instagram"></a>
                        </div>
                    </div>

                    <div className="company-page__transports">
                        {
                            this.state.company.transports &&
                            this.state.company.transports.map(
                                (transport, index) => 
                                <TransportCompany
                                transport={transport}
                                company={this.state.company}
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


export default withRouter(CompanyPage)