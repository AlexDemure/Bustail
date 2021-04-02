import React from 'react';

import './css/transport_min.css'

export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    
    }
    render() {
        return (
            <div className="transport-min">
                <div className="photo" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
                <div className="info"  onClick={() => this.setState({typeWindow: "transport_card"})}>
                    <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    <p className="parametr">вместимость: <span>{this.props.transport.seats}</span></p>
                    <p className="parametr">стоимость: <span>{this.props.transport.price}</span></p>
                    <p className="parametr">город: <span>{this.props.transport.city}</span></p>
                </div>
                
                { this.state.typeWindow === "transport_card" && (
                    <div className="transport_card">
                        <div className="close_card" onClick={() => this.setState({typeWindow: ""})}></div>
                        
                        <div id="transport">
                            <p className="parametr">Описание автомобиля: <span>{this.props.transport.description}</span></p>
                        </div>

                    </div>
                    )   
                }

            </div>
        )
    }
}

