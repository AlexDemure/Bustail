import React from 'react';

import './css/transport.css'


export default class TransportOffer extends React.Component {
    constructor(props) {
        super(props)
    
    }
    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = this.props.transport.transport_covers[0].file_uri
        } else {
            image_url = null
        }
        return (
            <div className="transport__offer">
                <img 
                src={image_url}
                alt="preview"
                className="transport__offer__photo"
                onClick={() => this.props.showTransportCard(this.props.transport.id)}
                ></img>
                
                <div className="transport__offer__card">
                    <div className="transport__offer__card__title">
                        <p id="model">{this.props.transport.brand} {this.props.transport.model}</p>
                    </div>
                    <div className="transport__offer__card__body">
                        <div id="info">
                            <p className="transport__offer__item">город: <span>{this.props.transport.city}</span></p>
                        </div>
                    </div>
                    <div className="transport__offer__card__footer" onClick={this.props.createOffer}>
                        <p>Предложить</p>
                    </div>
                </div>
                
                

            </div>
        )
    }
}

