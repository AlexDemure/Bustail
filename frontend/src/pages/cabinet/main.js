import React from 'react'

import './css/main.css'

import CabinetSwitch from '../../components/common/swithes/cabinet'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import ClientInfoForm from '../../components/forms/cabinet/client'
import PaymentData from '../../components/common/payment_data'
import TransportItem from '../../components/common/transports/transport_cabinet'

const cities = [
    "Челябинск", "Уфа", "Москва"
]


const transports = [
    {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Челябинск",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Москва",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   }
]

function DriverForm(params) {
    return (
        <div className="driver">
            <PaymentData total={15500} commission={502} debt={250} limit={5000}/>
            <p id="warning">При достижении лимита подбор заявок будет не доступен</p>
            <div className="transports">
                <p id="header">Автопарк</p>
                {
                    transports.map(
                        (transport) => <TransportItem transport={transport}/>
                    )
                }
            </div>
        </div>
    )
}


export default class CabinetPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "common",

        };
        this.changeForm = this.changeForm.bind(this)
    }

    changeForm(event) {
        event.preventDefault();

        if (this.state.form === "common") {
            this.setState({
                form: "driver",
            })
        } else{
            this.setState({
                form: "common",
            }) 
        }
    }

    render() {
        let form;

        if (this.state.form === "driver") {
            form = <DriverForm/>
        }else {
            form = <ClientInfoForm cities={cities}/>
        }

        return (
            <div className={"container cabinet " + this.state.form}>
                <Header previous_page="/main" page_name="Личный кабинет"/>
                <CabinetSwitch is_active={this.state.form} onClick={this.changeForm}/>
                {form}
                <NavBar/>
            </div>
        )
    }
}