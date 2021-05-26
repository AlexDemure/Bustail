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
            let choices = this.state.choices_type === "personal" ? this.props.driver_transports : this.props.company_transports
            
            form = <OfferModal
            title={this.props.title}
            offer_type={this.props.offer_type}
            closeOffer={this.props.closeOffer}
            create_link={this.props.create_link}
            
            activeChoiceType={this.state.choices_type}
            createOffer={this.createOffer}
            changeChoicesType={this.changeChoicesType}
            
            choices={
                choices.length > 0 ?
                choices.map(
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