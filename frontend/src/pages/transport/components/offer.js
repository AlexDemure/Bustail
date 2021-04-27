import React from 'react'

import TicketOffer from './ticket'

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
                        <div className="offer__common__modal-window__close-btn" onClick={this.props.closeOffer}></div>
                    </div>
                    <div>
                        <p className="offer__common__modal-window__text">Выберите элемент из списка</p>
                        <a href={this.props.create_link} className="offer__common__modal-window__create-object">Создать</a>
                    </div>
                    
                    <div className="offer__common__modal-window__choices">
                        {
                            this.props.choices.length > 0 ?
                            this.props.choices.map(
                                (choice) =>
                                <TicketOffer
                                createOffer={(e) => this.props.createOffer(e, choice.id)}
                                ticket={choice}/>
                            ) :
                            <p className="offer__common__modal-window__no-choices-text">Список предложений пуст</p>
                        }
                    </div>
                </div>
            </div>
        )
    }
}