import React from 'react';

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportCompany extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transport_id: null,
            phone: null
        }

        this.getDriveInfo = this.getDriveInfo.bind(this)
    }

    getDriveInfo() {
        sendRequest(`/api/v1/drivers/${this.props.transport.driver_id}/`, "GET")
        .then(
            (result) => {
                sendRequest(`/api/v1/accounts/${result.account_id}/`, "GET")
                .then(
                    (result) => {
                        this.setState({
                            phone: result.phone
                        })
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (error) => {
                console.log(error)
            }
        )
    }

    async componentDidMount() {
        this.getDriveInfo()
    }

    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_covers[0].id}`
        } else {
            image_url = null
        }
        
        
        return (
            <div className="transport__company">
                <img 
                    src={image_url}
                    alt="preview"
                    className="transport__company__photo"
                    >
                </img>
                <div className="transport__company__card">
                    <div className="transport__company__card__title">
                        <p id="model">{this.props.transport.brand} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__company__card__body">
                        <div id="info">
                            <p className="transport__company__item">вместимость: <span>{this.props.transport.count_seats}</span></p>
                            <p className="transport__company__item">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="transport__company__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__company__card__controls">
                        <a href={"tel:"+ this.state.phone} className="transport__company__control contacts"><div></div></a>
                        <div className="transport__company__control info" onClick={this.props.showTransportCard}></div>
                        <div className="transport__company__control offer" onClick={this.props.openOffer}></div>
                    </div>
                </div>
                
            </div>
        )
    }
}

