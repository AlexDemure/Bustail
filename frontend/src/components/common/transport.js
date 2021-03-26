import React from 'react';

import './css/transport.css'

export default class TransportItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            typeWindow: ""
        }
    
    }
    render() {
        return (
            <div className="transport">
                <div className="photo"></div>
                <div className="info">
                    <p id="model">{this.props.transport.mark} {this.props.transport.model}</p>
                    <p className="parametr">вместимость: <span>{this.props.transport.seats}</span></p>
                    <p className="parametr">стоимость: <span>{this.props.transport.price}</span></p>
                    <p className="parametr">город: <span>{this.props.transport.city}</span></p>
                </div>
                <div className="controls">
                    <a href={"tel:"+ this.props.phone} className="control_icon" id="contacts"><div></div></a>
                    <div className="control_icon" id="info" onClick={() => this.setState({typeWindow: "transport_card"})}></div>
                    <div className="control_icon" id="offer"></div>
                </div>
                
                { this.state.typeWindow === "transport_card" && (
                    <div className="transport_card">
                        <div className="close_card" onClick={() => this.setState({typeWindow: ""})}></div>
                        <div id="driver">
                            <p className="parametr">Водитель: <span>{this.props.transport.driver}</span></p>
                            <p className="parametr">Лицензия перевозчика: <span>{this.props.transport.driver_license ? this.props.transport.driver_license : "Отсутствует"}</span></p>
                        </div>
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

