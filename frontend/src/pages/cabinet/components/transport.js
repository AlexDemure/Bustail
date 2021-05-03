import React from 'react';

import './css/transport.css'


export default class TransportCabinet extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let image_url
        if (this.props.transport.transport_covers.length > 0) {
            image_url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/${this.props.transport.transport_covers[0].id}`
        } else {
            image_url = null
        }

        return (
            <div className={"transport__cabinet"}>
                <img 
                    src={image_url}
                    className="transport__cabinet__photo"
                    onClick={() => this.props.showTransportCard(this.props.transport.id)}>
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
                    <div className="transport__cabinet__card__footer" id="remove" onClick={this.props.deleteTransport}>
                        <p>Удалить</p>
                    </div>
                </div>
            </div>
        )
    }
}

