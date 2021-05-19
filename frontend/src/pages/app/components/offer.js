import React from 'react'

import ChangePrice from '../../../components/common/change_price_modal'
import Transport from '../../../components/cards/transport'

import SerializeForm from '../../../utils/form_serializer'


import ChoicesTypeSwitch from './switch_choices_type'

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
                
                <ChoicesTypeSwitch is_active={props.activeChoiceType} onClick={props.changeChoicesType}/>

                <div className="offer__transport__modal-window__choices">
                    {
                        props.choices.length > 0 ?
                        props.choices.map(
                            (choice) =>
                            <Transport
                            controls="offer"
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
            choices_type: "personal",
            
            transport_id: null,
            price: null,
        }

        this.changeChoicesType = this.changeChoicesType.bind(this)
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

    changeChoicesType(event) {
        event.preventDefault();

        if (event.target.id === "personal") {
            this.setState({
                choices_type: "personal",
            })
        } else if (event.target.id === "company"){
            this.setState({
                choices_type: "company",
            }) 
        }
    }

    render() {
        let form;

        if (this.state.form === "choices") {
            form = <ChoicesElements
            choices={this.state.choices_type === "personal" ? this.props.driver_transports : this.props.company_transports}
            price={this.state.price}
            showTransportCard={this.props.showTransportCard}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}

            activeChoiceType={this.state.choices_type}
            createOffer={this.createOffer}
            changeChoicesType={this.changeChoicesType}
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