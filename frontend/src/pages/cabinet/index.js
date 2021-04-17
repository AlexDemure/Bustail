import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import CabinetSwitch from './components/switch_cabinet'
import PaymentData from './components/payment_data'
import TransportCabinet from './components/transport'

import isAuth from '../../utils/is_auth'
import SerializeForm from '../../utils/form_serializer'
import sendRequest from '../../utils/fetch'

import ClientInfoForm from './forms/client'

import './css/index.css'



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

function DriverPage(props) {
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
            user: {
                email: null,
                city: null,
                phone: null,
                id: null
            },
            cities: []
            

        };
        this.changeForm = this.changeForm.bind(this)
        this.changeInfo = this.changeInfo.bind(this)
    }

    changeInfo(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        let data = {
            phone: prepared_data.get("phone"),
            fullname: prepared_data.get("fullname"),
            city: prepared_data.get("city")
        }
        sendRequest('/api/v1/accounts/', "PUT", data)
        .then(
            (result) => {
                console.log(result);
            },
            (error) => {
                console.log(error.message);
            }
        )
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

    getCities() {
        sendRequest('/api/v1/cities/', "GET")
        .then(
            (data) => {
                console.log(data);
                this.setState({cities: data});
            }
        )
    }

    aboutMe() {
        sendRequest('/api/v1/accounts/me/', "GET")
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    user: {
                        email: result.email,
                        city: result.city,
                        phone: result.phone,
                        fullname: result.fullname,
                        id: result.id
                    }
                })
            },
            (error) => {
                console.log(error.message);
            }
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.cities !== this.props.cities) {
            this.setState({
                cities: this.props.cities
            })
        }
    }

    componentDidMount() {
        isAuth()
        this.aboutMe()
        this.getCities()
    }

    render() {
        let form;

        if (this.state.form === "driver") {
            form = <DriverPage/>
        } else {
            form = <ClientInfoForm changeInfo={this.changeInfo} user={this.state.user} cities={this.state.cities}/>
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