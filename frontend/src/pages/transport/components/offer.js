import React from 'react'

import ChangePrice from '../../../components/common/modal/change_price'
import Ticket from '../../../components/common/cards/ticket/index'
import OfferModal from '../../../components/common/modal/offer'

import SerializeForm from '../../../utils/form_serializer'


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
            form = <OfferModal
            title={this.props.title}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}
            choices={
                this.props.choices.length > 0 ?
                this.props.choices.map(
                    (choice) => {
                        if (choice.application_status !== "confirmed") {
                            return <Ticket
                            controls="offer"
                            makeOffer={(e) => this.createOffer(e, choice.id, choice.price)}
                            showTicketCard={() => this.props.showTicketCard(choice.id)}
                            ticket={choice}
                            />
                        }
                    }
                    
                ) : []
            }
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