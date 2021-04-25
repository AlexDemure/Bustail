import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import Header from '../../../components/common/header'
import NavBar from '../../../components/common/navbar'

import PaymentData from '../components/payment_data'
import TransportCabinet from '../components/transport'
import CabinetSwitch from '../components/switch_cabinet'

import { getDriverCard } from '../../../components/common/api/driver_card'

import { selectErrorInputs } from '../../../constants/input_parsers'

import sendRequest from '../../../utils/fetch'
import SerializeForm from '../../../utils/form_serializer'

import './css/driver.css'


class CreateDriverForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            
            <React.Fragment>
                <p id="warning">Для оказания услуг перевозок водитель должен обладать лицензией перевозчика или выполнять заказы от компании.</p>
                <form className="cabinet__driver__form__create-driver" onSubmit={this.props.createDriver} autoComplete="off">
                    <DefaultInput name="company_name" input_type="text" size="25" placeholder="Наименование Юр.лица, ИП"/>
                    <DefaultInput name="inn" input_type="text" size="25" placeholder="ИНН"/>
                    <DefaultInput name="license_number" input_type="text" size="25" placeholder="Номер лицензии"/>
                    <SubmitButton value="Создать"/>
                </form>
            </React.Fragment>
           
        )
    }
}

class DriverCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="cabinet__driver"> 
                <PaymentData
                total={this.props.driver.total_amount}
                commission={`${this.props.driver.commission}%`}
                debt={this.props.driver.debt}
                limit={this.props.driver.limit}
                />
                <p className="cabinet__driver__notify">При достижении суммы коммиссии свыше допустимого лимита подбор заявок будет не доступен</p>
                <div className="cabinet__driver__transports">
                    
                    <p className="cabinet__driver__title">Автопарк</p>
                    {   
                        this.props.driver.transports &&
                        this.props.driver.transports.map(
                            (transport) => <TransportCabinet transport={transport}/>
                        )
                    }
                </div>
            </div>
        )
    }

}

export default class DriverPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            form: "form",
            driver: null,
            error: null
        }

        this.createDriver = this.createDriver.bind(this)
    }

    createDriver(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))

        let data = {
            company_name: prepared_data.get("company_name"),
            inn: prepared_data.get("inn"),
            license_number: prepared_data.get("license_number")
        }
        sendRequest('/api/v1/drivers/', "POST", data)
        .then(
            (result) => {
                if (this.state.error) {
                    selectErrorInputs(this.state.error, false)
                }
                this.setState({
                    form: "card",
                    driver: {
                        id: result.id,
                        license_number: result.license_number,
                        inn: result.inn,
                        company_name: result.company_name,
                        account_id: result.account_id,
                        transports: result.transports,
                        id: result.id,
                        total_amount: result.total_amount,
                        commission: result.commission,
                        debt: result.debt,
                        limit: result.limit
                    },
                    error: null
                }) 
            },
            (error) => {
                this.setState({error: error.message})

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                }
            }
        )
    }
    
    async componentDidMount(){
        let driver = await getDriverCard()
        if (driver) {
            this.setState({
                form: "card",
                driver: driver
            })
        }
    }

    render() {
        let form;

        if (this.state.form === "card") {
            form = <DriverCard driver={this.state.driver}/>
        } else {
            form = <CreateDriverForm createDriver={this.createDriver}/>
        }
        return (
            <div className={"container cabinet driver " + this.state.form}>
                <Header previous_page="/main" page_name="Личный кабинет"/>
                <CabinetSwitch is_active="driver" onClick={this.props.changeForm}/>
                {form}
                <NavBar/>
            </div>
        )
    }
}


