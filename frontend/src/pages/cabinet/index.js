import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import CabinetSwitch from './components/switch_cabinet'
import PaymentData from './components/payment_data'
import TransportCabinet from './components/transport'


import ClientInfoForm from './forms/client'

import './css/index.css'

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

function DriverPage(params) {
    return (
        <div className="cabinet__driver">
            <PaymentData total={15500} commission={502} debt={250} limit={5000}/>
            <p className="cabinet__driver__notify">При достижении суммы коммиссии свыше допустимого лимита подбор заявок будет не доступен</p>
            <div className="cabinet__driver__transports">
                <p className="cabinet__driver__title">Автопарк</p>
                {
                    transports.map(
                        (transport) => <TransportCabinet transport={transport}/>
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
            form = <DriverPage/>
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