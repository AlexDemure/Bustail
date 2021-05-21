import React from 'react';

import sendRequest from '../../../utils/fetch'

import './css/base.css'


function NotificationControls(props) {
    let controls;

    if (
        (props.notification_owner === "driver" && props.notification_type === "driver_to_client") || 
        (props.notification_owner === "client" && props.notification_type === "client_to_driver") 
    ) {
        controls = <p className="transport__notification__btn-remove-offer" onClick={props.removeOffer}>Отменить предложение</p>
    } else if (
        (props.notification_owner === "driver" && props.notification_type === "client_to_driver") || 
        (props.notification_owner === "client" && props.notification_type === "driver_to_client")
    ) {
        controls = 
        <React.Fragment>
            <p id="accept" className="transport__notification__btn-set-decision-offer accept" onClick={props.setOfferDecision}>Принять</p>
            <p id="reject" className="transport__notification__btn-set-decision-offer reject" onClick={props.setOfferDecision}>Отменить</p>
        </React.Fragment>
    }

    return (
        <div className="transport__card__controls notification" id="notification">
            {controls}
        </div>
    )
}

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

        this.getDriveInfo = this.getDriveInfo.bind(this)
    }

    getDriveInfo() {
        sendRequest(`/api/v1/drivers/${this.props.transport.driver_id}/`, "GET")
        .then(
            (result) => {
                this.setState({
                    phone: result.account.phone
                })    
            },
            (error) => {
                console.log(error)
            }
        )
    }

    async componentDidMount() {
        if (this.props.transport.driver_id !== null) {
            this.getDriveInfo()
        }
    }

    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = this.props.transport.transport_covers[0].file_uri
        } else {
            image_url = null
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
        
        } else if (this.props.controls === "notification") {
             // Используется на странице Уведомления
            controls = <NotificationControls
            notification_owner={this.props.notification_owner}
            notification_type={this.props.notification_type}
            setOfferDecision={this.props.setOfferDecision}
            removeOffer={this.props.removeOffer}
            />
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

