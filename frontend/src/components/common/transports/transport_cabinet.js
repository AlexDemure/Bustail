import React from 'react';

import './css/transport_cabinet.css'
import './css/base.css'

import AboutCard from './about'

export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    
    }
    render() {
        return (
            <div className="transport cabinet">
                <div className="photo" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
                <div className="card">
                    <div className="title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="body">
                        <div id="info">
                            <p className="parametr">вместимость: <span>{this.props.transport.seats}</span></p>
                            <p className="parametr">стоимость: <span>{this.props.transport.price}</span></p>
                            <p className="parametr">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="footer" id="remove">
                        <p>Удалить</p>
                    </div>
                </div>

                { this.state.typeWindow === "transport_card" && (
                    <AboutCard
                    onClick={() => this.setState({typeWindow: ""})}
                    description={this.props.transport.description}
                    />
                    )   
                }

            </div>
        )
    }
}

