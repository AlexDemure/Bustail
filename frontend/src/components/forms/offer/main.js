import React from 'react'

import './css/main.css'


export default class OfferForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="modal">
                <div className="form-offer">
                    <div>
                        <p className="offer_type">{this.props.offer_type}</p>
                        <div className="close_modal" onClick={this.props.onClick}></div>
                    </div>
                    <div>
                        <p id="choose-text">Выберите элемент из списка</p>
                        <a href={this.props.create_link} className="create_object">Создать</a>
                    </div>
                    <div className="choices">
                        {this.props.choices}
                    </div>
                </div>
            </div>
        )
    }
}