import React from 'react';

import TransportCard from '../../../components/common/transport_card'

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportSearch extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transport_id: null,
            phone: null
        }

        this.getDriveInfo = this.getDriveInfo.bind(this)
    }

    onClickHandler(e, transport_id) {
        this.setState({
            transport_id: transport_id
        })
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
            <div className="transport__search">
                <img 
                    src={image_url}
                    className="transport__search__photo"
                    >
                </img>
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
                        <div className="transport__search__control info" onClick={(e) => this.onClickHandler(e, this.props.transport.id)}></div>
                        <div className="transport__search__control offer" onClick={this.props.openOffer}></div>
                    </div>
                </div>
                
                
                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }
                
            </div>
        )
    }
}

