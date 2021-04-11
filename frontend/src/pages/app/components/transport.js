import React from 'react';

import './css/transport_offer.css'
import './css/base.css'

import AboutCard from '../../../components/transports/about'

export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    
    }
    render() {
        return (
            <div className="transport offer">
                <div className="photo" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
                <div className="card">
                    <div className="title">
                        <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    </div>
                    <div className="body">
                        <div id="info">
                            <p className="parametr">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="footer">
                        <p>Предложить</p>
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

