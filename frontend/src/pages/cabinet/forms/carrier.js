import React from 'react'

import DriverPage from './driver'
import CompanyPage from './company'

import './css/carrier.css'


function ChoiceCarrierType(props) {
    return (
        <div className="container choice-transport">
            <div className="cabinet-carrier__choice-carrier">
                <p id="driver" onClick={props.choiceCarrier}>Частный водитель | для Физ.лиц</p>
                <p id="company" onClick={props.choiceCarrier}>Компания-перевозчик | для Юр.лиц</p>
            </div>
        </div>
    )
}

export default class CarrierPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            carrier_type: null,
            carrier: null,
            transports: null,
        }

        this.choiceCarrier = this.choiceCarrier.bind(this)
    }

    choiceCarrier(e) {
        if (e.target.id === "driver") {
            this.setState({
                carrier_type: "driver",
            })
        } else if (e.target.id === "company"){
            this.setState({
                carrier_type: "company",
            }) 
        }
    }

    componentDidMount() {
        this.setState({
            carrier_type: this.props.carrier_type,
            carrier: this.props.carrier,
            transports: this.props.transports,
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                carrier_type: this.props.carrier_type,
                carrier: this.props.carrier,
                transports: this.props.transports,
            })
        }
    }

    render() {
        let form;

        if (this.state.carrier_type == "company") {
            form = <CompanyPage
            changeForm={this.props.changeForm}
            company={this.state.carrier}
            transports={this.state.transports}
            setCarrier={this.props.setCarrier}
            />
        } else if (this.state.carrier_type == "driver") {
            form = <DriverPage
            changeForm={this.props.changeForm}
            driver={this.state.carrier}
            transports={this.state.transports}
            setCarrier={this.props.setCarrier}
            />
        } else {
            form = <ChoiceCarrierType choiceCarrier={this.choiceCarrier}/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}