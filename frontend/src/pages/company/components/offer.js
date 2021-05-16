import React from 'react'

import ChangePrice from '../../../components/common/change_price_modal'

import SerializeForm from '../../../utils/form_serializer'

import TicketOffer from './ticket'

import './css/offer.css'


function ChoicesElements(props) {
    return (
        <div className="offer__application__modal-window__bg">
            <div className="offer__application__modal-window__content">
                <div>
                    <p className="offer__application__modal-window__title">{props.offer_type}</p>
                    <div className="offer__application__modal-window__close-btn" onClick={props.closeOffer}></div>
                </div>
                <div>
                    <p className="offer__application__modal-window__text">Выберите элемент из списка</p>
                    <a href={props.create_link} className="offer__application__modal-window__create-object">Создать</a>
                </div>
                <div className="offer__application__modal-window__choices">
                    {
                        props.choices.length > 0 ?
                        props.choices.map(
                            (choice) =>
                            <TicketOffer
                            createOffer={(e) => props.createOffer(e, choice.id, choice.price)}
                            ticket={choice}/>
                        ) :
                        <p className="offer__application__modal-window__no-choices-text">Список предложений пуст</p>
                    }
                </div>
            </div>
        </div>
    )
}

export default class OfferForm extends React.Component {
    constructor(props) {
        super(props)
        
        this.state = {
            form: "choices",
            ticket_id: null,
            price: null,
        }
        this.setPrice = this.setPrice.bind(this)
        this.createOffer = this.createOffer.bind(this)
    }

    createOffer(e, ticket_id, price) {
        this.setState({
            ticket_id: ticket_id,
            price: price,
            form: "price"
        })
    }
    
    setPrice(e) {
        e.preventDefault();
        let prepared_data = SerializeForm(e.target, new FormData(e.target))
        this.props.createOffer(e, this.state.ticket_id, prepared_data.get("price"))
    }

    render() {
        let form;

        if (this.state.form === "choices") {
            form = <ChoicesElements
            choices={this.props.choices}
            createOffer={this.createOffer}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}
            />
        } else if (this.state.form === "price") {
            form = <ChangePrice
            closeOffer={this.props.closeOffer}
            onSubmit={this.setPrice}
            value={this.state.price}
            />
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}