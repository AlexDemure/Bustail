import React from 'react';

import TransportCard from '../../../components/common/transport_card'

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportCabinet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transport_id: null,
            isDeleted: false
        }

        this.deleteTransport = this.deleteTransport.bind(this)
    }
    
    deleteTransport() {
        sendRequest(`api/v1/drivers/transports/${this.props.transport.id}/`, "DELETE")
        .then(
            (result) => {
                console.log(result)
            },
            (error) => {
                console.log(error)
            }
        )
    }
    render() {
        let image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_cover}`

        return (
            <div className={"transport__cabinet"}>
                <img 
                    src={image_url}
                    className="transport__cabinet__photo"
                    onClick={() => this.setState({transport_id: this.props.transport.id})}>
                </img>

                <div className="transport__cabinet__card">
                    <div className="transport__cabinet__card__title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__cabinet__card__body">
                        <div id="info">
                            <p className="transport__cabinet__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__cabinet__card__footer" id="remove" onClick={this.deleteTransport}>
                        <p>Удалить</p>
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

