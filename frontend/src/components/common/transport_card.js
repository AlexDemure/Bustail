import React from 'react'

import { getTransportCard } from '../common/api/transport_card'
import { getCompanyCard } from '../common/api/company_card'

import sendRequest from '../../utils/fetch'

import './css/transport_card.css'


export default class TransportCard extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            driver: null,
            company: null,

            user: {
                fullname: null,
                phone: null
            },
            transport: {
                driver_id: null,
                company_id: null,
                brand: null,
                model: null,
                state_number: null,
                price: null,
                city: null,
                count_seats: null,
                transport_covers: []
            }
        }
    }

    async getDriverInfo(driver_id) {
        let driver;

        await sendRequest(`/api/v1/drivers/${driver_id}/`, "GET")
        .then(
            (result) => {
                console.log(result)
                driver = result
                return driver
            },
            (error) => {
                console.log(error)
                driver = null
            }
        )

        return driver
    }

    async getUserInfo(account_id) {
        let user;

        await sendRequest(`/api/v1/accounts/${account_id}/`, "GET")
        .then(
            (result) => {
                console.log(result)
                user = result
                return user
            },
            (error) => {
                console.log(error)
                user = null
            }
        )

        return user
    }

    async componentDidMount() {
        let user;
        let driver;
        let company;
        let transport = await getTransportCard(this.props.transport_id)
        
        if (transport.driver_id !== null) {
            driver = await this.getDriverInfo(transport.driver_id)

            if (driver) {
                user = await this.getUserInfo(driver.account_id)
            }
        }

        if (transport.company_id !== null) {
            company = await getCompanyCard(transport.company_id)
            if (company) {
                user = await this.getUserInfo(company.account_id)
            }
        }
        
        this.setState({
            user: user,
            driver: driver,
            company: company,
            transport: transport,
        })
    }

    render() {
        let image_url
        
        if (this.state.transport.transport_covers.length > 0) {
            image_url = `/api/v1/drivers/transports/${this.state.transport.id}/covers/${this.state.transport.transport_covers[0].id}`
        } else {
            image_url = null
        }
        
       
        return(
            <div className="transport_card__modal-window__bg">
                <div className="transport_card__modal-window__content">
                    <div>
                        <p className="transport_card__modal-window__title">Карточка автомобиля</p>
                        <div className="transport_card__modal-window__close-btn" onClick={this.props.onClose}></div>
                    </div>
                    <div className="transport_card__modal-window__card">
                        <div className="transport_card__photos">
                        <img 
                            src={image_url}
                            alt="preview"
                            className="transport_card__photo"
                        ></img>
                        <div className="transport_card__other-photos">
                            <div>
                                <p>+</p>
                            </div>
                            <div>
                                <p>+</p>
                            </div>
                            <div>
                                <p>+</p>
                            </div>
                        </div>
                    </div>
                        <div className="transport_card__details">
                            <p className="transport_card__detail transport-name">{this.state.transport.brand} {this.state.transport.model}</p>
                            <p className="transport_card__detail state-number">{this.state.transport.state_number}</p>
                            <div className="transport_card__additionals">
                                <p className="transport_card__detail count-seats"><span>Вместимость:</span> {this.state.transport.count_seats}</p>
                                <p className="transport_card__detail price"><span>Стоимость:</span> {this.state.transport.price}</p>
                                <p className="transport_card__detail city"><span>Город:</span> {this.state.transport.city}</p>
                                {
                                    this.state.transport.company_id &&
                                    <a 
                                    href={`/company/pages/${this.state.company.page_url}`}
                                    className="transport_card__detail driver-name"><span id="company">Компания: {this.state.company.company_name}</span>
                                    </a>
                                }
                                {
                                    this.state.transport.driver_id &&
                                    <p className="transport_card__detail driver-name"><span>Водитель:</span> {this.state.user.fullname ? this.state.user.fullname : "Не указано"}</p>
                                }
                                
                                <p className="transport_card__detail phone"><span>Телефон:</span> {this.state.user.phone ? this.state.user.phone : "Не указано"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
       
    }
}