import React from 'react';

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
            phone: null
        }

        this.getDriveInfo = this.getDriveInfo.bind(this)
    }

    onClick(window) {
        this.setState({typeWindow: window})
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
        return (
            <div className="transport__search">
                <div className="transport__search__photo"></div>
                <div className="transport__search__card">
                    <div className="transport__search__card__title">
                        <p id="model">{this.props.transport.brand} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__search__card__body">
                        <div id="info">
                            <p className="transport__search__item">вместимость: <span>{this.props.transport.count_seats}</span></p>
                            <p className="transport__search__item">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="transport__search__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__search__card__controls">
                        <a href={"tel:"+ this.state.phone} className="transport__search__control contacts"><div></div></a>
                        <div className="transport__search__control info" onClick={() => this.onClick("transport_card")}></div>
                        <div className="transport__search__control offer" onClick={this.props.openOffer}></div>
                    </div>
                </div>
                
                
                { this.state.typeWindow === "transport_card" && (
                        <div className="transport__search__about">
                            <div className="transport__search__about__close-btn" onClick={() => this.setState({typeWindow: ""})}></div>
                            <div className="transport__search__about__details">
                                <p className="transport__search__about__item">Описание: <span>{this.props.transport.description}</span></p>
                            </div>
                        </div>
                    )   
                }
                
            </div>
        )
    }
}

