import React from 'react';

import {getDriverCard} from '../../../common/api/drivers/get_by_id'
import {getCompanyCard} from '../../../common/api/company/get_by_id'

import './css/base.css'


function OfferControls(props) {
    return (
        <div className="transport__card__controls offer" id="offer" onClick={props.createOffer}>
            <p>Предложить</p>
        </div>
    )
}

function RemoveControls(props) {
    return (
        <div className="transport__card__controls remove" id="remove" onClick={props.deleteTransport}>
            <p>Удалить</p>
        </div>
    )
}

function MultiControls(props) {
    return (
        <div className="transport__card__controls multi">
            {
                props.transport.company_page_url !== null &&
                <a href={`/company/${props.transport.company_page_url}`} className="transport__card__control company"><div></div></a>
            }
            {
                props.transport.company_page_url === null &&
                <div className="transport__card__control person"></div>
            }
            <a href={"tel:"+ props.phone} className="transport__card__control contacts"><div></div></a>
            <div className="transport__card__control info" onClick={props.showTransportCard}></div>
            <div className="transport__card__control offer" onClick={props.openOffer}></div>
        </div>
    )
}

export default class Transport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: null
        }

        this.getOwnerInfo = this.getOwnerInfo.bind(this)
    }

    async getOwnerInfo() {
        if (this.props.transport.driver_id) {
            let response = await getDriverCard(this.props.transport.driver_id)
            this.setState({
                phone: response.result.account.phone
            })
        } else if (this.props.transport.company_id) {
            let response = await getCompanyCard(this.props.transport.company_id)
            this.setState({
                phone: response.result.account.phone
            })
        }
    }

    async componentDidMount() {
        await this.getOwnerInfo()
    }

    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = this.props.transport.transport_covers[0].file_uri
        } else {
            image_url = '/default_cover.jpg'
        }
        
        let controls;

        if (this.props.controls === "multi") {
            // Используется на страницах Поиск транспорта, Страницы компании
            controls = <MultiControls
            transport={this.props.transport}
            phone={this.state.phone}
            showTransportCard={this.props.showTransportCard}
            openOffer={this.props.openOffer}
            />
        
        } else if (this.props.controls === "remove") {
            // Используется В Личном кабинете
            controls = <RemoveControls deleteTransport={this.props.deleteTransport}/>
        
        } else if (this.props.controls === "offer") {
            // Используется в модальном окне Предложение транспорта
            controls = <OfferControls createOffer={this.props.createOffer}/>
        
        }
        
        return (
            <div className="transport">
                <img 
                    src={image_url}
                    alt="preview"
                    className="transport__photo"
                    onClick={() => this.props.showTransportCard(this.props.transport.id)}
                    >
                </img>
                <div className="transport__card">
                    <div className="transport__card__title">
                        <p id="model">{this.props.transport.brand} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__card__body">
                        <div id="info">
                            <p className="transport__card__item">вместимость: <span>{this.props.transport.count_seats}</span></p>
                            <p className="transport__card__item">стоимость: <span>{this.props.transport.price === 0 ? "Не указано" : this.props.transport.price}</span></p>
                            <p className="transport__card__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>

                    {controls}

                </div>
                
            </div>
        )
    }
}

