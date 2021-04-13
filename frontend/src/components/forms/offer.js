import React from 'react'

import './css/offer.css'


export default class OfferForm extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="offer__common__modal-window__bg">
                <div className="offer__common__modal-window__content">
                    <div>
                        <p className="offer__common__modal-window__title">{this.props.offer_type}</p>
                        <div className="offer__common__modal-window__close-btn" onClick={this.props.onClick}></div>
                    </div>
                    <div>
                        <p className="offer__common__modal-window__text">Выберите элемент из списка</p>
                        <a href={this.props.create_link} className="offer__common__modal-window__create-object">Создать</a>
                    </div>
                    <div className="offer__common__modal-window__choices">
                        {this.props.choices}
                    </div>
                </div>
            </div>
        )
    }
}