import React from 'react';



import './css/transport_notification.css'
import './css/base.css'

import AboutCard from './about'


export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: "",
        }
    }

    onClick(window) {
        this.setState({typeWindow: window})
    }

    render() {
        return (
            <div id={this.props.transport.id} className="transport notification">
                <div className="photo"></div>
                <div className="card">
                    <div className="control_icon" id="reject" onClick={() => this.props.rejectOffer(this.props.transport.id)}></div>
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
                    <div className="controls">
                        <a href={"tel:"+ this.props.phone} className="control_icon" id="contacts"><div></div></a>
                        <div className="control_icon" id="info" onClick={() => this.onClick("transport_card")}></div>
                        <div className="control_icon" id="accept" onClick={() => this.onClick("accept")}></div>
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

