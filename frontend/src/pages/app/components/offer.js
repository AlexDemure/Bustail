import React from 'react'

import ChangePrice from '../../../components/common/modal/change_price'
import OfferModal from '../../../components/common/modal/offer'
import Transport from '../../../components/common/cards/transport'

import SerializeForm from '../../../utils/form_serializer'


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
            form = <OfferModal
            title={this.props.title}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}
            
            activeChoiceType={this.state.choices_type}
            createOffer={this.createOffer}
            changeChoicesType={this.changeChoicesType}
            
            choices={
                this.props.transports.length > 0 ?
                this.props.transports.map(
                    (choice) => {
                        return <Transport
                        controls="offer"
                        createOffer={(e) => this.createOffer(e, choice.id)}
                        showTransportCard={this.props.showTransportCard}
                        transport={choice}/>
                    }
                ) : []
            }
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