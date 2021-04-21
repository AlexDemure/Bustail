import React from 'react';

import sendRequest from '../../../utils/fetch'

import './css/transport.css'


export default class TransportCabinet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
            isDeleted: false
        }

        // this.deleteTransport = this.deleteTransport.bind(this)
    }
    
    // deleteTransport() {
    //     sendRequest(`api/v1/drivers/transports/${this.props.transport.id}/`, "DELETE")
    //     .then(
    //         (result) => {
    //             console.log(result)
    //         },
    //         (error) => {
    //             console.log(error)
    //         }
    //     )
    // }
    render() {
        let image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_cover}`

        return (
            <div className={"transport__cabinet"}>
                <img 
                    src={image_url}
                    className="transport__cabinet__photo"
                    onClick={() => this.setState({typeWindow: "transport_card"})}>
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
                    <div className="transport__cabinet__card__footer" id="remove">
                        <p>Удалить</p>
                    </div>
                </div>

                { this.state.typeWindow === "transport_card" && (
                    <div className="transport__cabinet__about">
                        <div className="transport__cabinet__about__close-btn" onClick={() => this.setState({typeWindow: ""})}></div>
                        <div className="transport__cabinet__about__details">
                            <p className="transport__cabinet__about__item">Описание: <span>{this.props.transport.description}</span></p>
                        </div>
                    </div>
                    )   
                }

            </div>
        )
    }
}

