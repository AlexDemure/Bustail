import React from 'react';

import './css/transport.css'


export default class TransportCabinet extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    
    }
    render() {
        return (
            <div className="transport__cabinet">
                <div className="transport__cabinet__photo" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
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
