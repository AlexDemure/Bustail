import React from 'react'

import { getTransportCard } from '../api/transports/get_by_id'
import { getCompanyCard } from '../api/company/get_by_id'
import { getDriverCard } from '../api/drivers/get_by_id'

import ZoomPhoto from './zoom'

import './css/base.css'
import './css/transport.css'


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
            },

            zoomMode: false,
            zoomObject: null,
        }
    }


    async componentDidMount() {
        let user;
        let driver;
        let company;
        let transport = await getTransportCard(this.props.transport_id)
        
        if (transport.result.driver_id !== null) {
            driver = await getDriverCard(transport.result.driver_id)

            if (driver.result) {
                user = {
                    fullname: driver.result.account.fullname,
                    phone: driver.result.account.phone
                }
            }
        }

        if (transport.result.company_id !== null) {
            company = await getCompanyCard(transport.result.company_id)
            user = {
                fullname: company.result.account.fullname,
                phone: company.result.company_phone
            }
        }
        
        this.setState({
            user: user,
            driver: driver ? driver.result: null,
            company: company ? company.result : null,
            transport: transport.result,
        })
    }

    render() {
        let main_img
        let div_blocks = []
        

        if (this.state.transport.transport_covers.length > 0) {
            main_img = this.state.transport.transport_covers[0].file_uri
        } else {
            main_img = null
        }
        
        for (let i = 0; i < 3 - this.state.transport.transport_covers.slice(1).length; i++) { // выведет 0, затем 1, затем 2
            div_blocks.push(
                <div></div>
            )
          }

          
        return(

            <React.Fragment>
                {
                    this.state.zoomMode &&
                    <ZoomPhoto file_uri={this.state.zoomObject.file_uri} onClick={() => this.setState({zoomMode: false})}/>
                }
                
                <div className="transport-modal modal-window__bg">
                    <div className="modal-window__content">
                        <div>
                            <p className="modal-window__title">Карточка автомобиля</p>
                            <div className="modal-window__close-btn" onClick={this.props.onClose}></div>
                        </div>
                        <div className="transport__card">
                            <div className="transport__card__photos">
                            {
                                main_img ?
                                <img 
                                    src={main_img}
                                    onClick={() => this.setState({
                                        zoomMode: true,
                                        zoomObject: this.state.transport.transport_covers[0],
                                    })}
                                    alt="preview"
                                    className="transport__card__photo"
                                ></img> :
                                <div></div>
                            }
                           
                            <div className="transport__card__other-photos">
                                {
                                    this.state.transport.transport_covers.length > 0 &&
                                    this.state.transport.transport_covers.slice(1).map(
                                        (cover, index) =>
                                        <img
                                        src={cover.file_uri}
                                        onClick={() => this.setState({
                                            zoomMode: true,
                                            zoomObject: this.state.transport.transport_covers[index + 1],
                                        })}
                                        
                                        alt="preview"
                                        className="transport__card__additional-photo">
                                        </img>
                                    )
                                }
                                {div_blocks}
                            </div>
                        </div>
                            <div className="transport__card__details">
                                <p className="transport__card__detail transport-name">{this.state.transport.brand} {this.state.transport.model}</p>
                                <p className="transport__card__detail state-number"><span>Номер:</span> {this.state.transport.state_number}</p>
                                <div className="transport__card__additionals">
                                    <p className="transport__card__detail count-seats"><span>Вместимость:</span> {this.state.transport.count_seats}</p>
                                    <p className="transport__card__detail price"><span>Стоимость:</span> {this.state.transport.price}</p>
                                    <p className="transport__card__detail city"><span>Город:</span> {this.state.transport.city}</p>
                                </div>
                                <div className="transport__card__owner">
                                    {
                                        this.state.transport.company_id &&
                                        <a 
                                        href={`/company/${this.state.company.page_url}`}
                                        className="transport__card__detail driver-name"><span id="company">Компания: {this.state.company.company_name}</span>
                                        </a>
                                    }
                                    {
                                        this.state.transport.driver_id &&
                                        <p className="transport__card__detail driver-name"><span>Водитель:</span> {this.state.user.fullname ? this.state.user.fullname : "Не указано"}</p>
                                    }
                                    
                                    <a href={"tel:"+ this.state.user.phone} className="transport__card__detail phone"><span>Телефон:</span> {this.state.user.phone ? this.state.user.phone : "Не указано"}</a>
                                </div>
                                <p className="transport__card__detail description"><span>Описание:</span> {this.state.transport.description ? this.state.transport.description: "Не указано"}</p>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
            
        )
       
    }
}