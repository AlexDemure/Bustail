import React from 'react'

import ChangePrice from '../../../components/common/change_price_modal'

import SerializeForm from '../../../utils/form_serializer'

import TransportOffer from './transport'

import './css/offer.css'

function ChoicesElements(props) {
    return (
        <div className="offer__transport__modal-window__bg">
            <div className="offer__transport__modal-window__content">
                <div>
                    <p className="offer__transport__modal-window__title">{props.offer_type}</p>
                    <div className="offer__transport__modal-window__close-btn" onClick={props.closeOffer}></div>
                </div>
                <div>
                    <p className="offer__transport__modal-window__text">Выберите элемент из списка</p>
                    <a href={props.create_link} className="offer__transport__modal-window__create-object">Создать</a>
                </div>
                
                <div className="offer__transport__modal-window__choices">
                    {
                        props.choices.length > 0 ?
                        props.choices.map(
                            (choice) =>
                            <TransportOffer
                            createOffer={(e) => props.createOffer(e, choice.id)}
                            showTransportCard={props.showTransportCard}
                            transport={choice}/>
                        ) :
                        <p className="offer__transport__modal-window__no-choices-text">Список предложений пуст</p>
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
            transport_id: null,
            price: null,
        }
        this.setPrice = this.setPrice.bind(this)
        this.createOffer = this.createOffer.bind(this)
    }

    createOffer(e, transport_id) {
        this.setState({
            transport_id: transport_id,
            form: "price"
        })
    }
    
    setPrice(e) {
        e.preventDefault();
        let prepared_data = SerializeForm(e.target, new FormData(e.target))
        this.props.createOffer(e, this.state.transport_id, prepared_data.get("price"))
    }

    render() {
        let form;

        if (this.state.form === "choices") {
            form = <ChoicesElements
            choices={this.props.choices}
            createOffer={this.createOffer}
            price={this.state.price}
            showTransportCard={this.props.showTransportCard}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}
            />
        } else if (this.state.form === "price") {
            form = <ChangePrice
            closeOffer={this.props.closeOffer}
            onSubmit={this.setPrice}
            value={this.props.ticket.price}
            />
        }
        
        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}