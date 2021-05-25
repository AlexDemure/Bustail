import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import TransportCard from '../../../components/common/transport_card'
import Transport from '../../../components/cards/transport'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import { createDriver } from '../../../components/common/api/drivers/create'
import { updateDriver } from '../../../components/common/api/drivers/update'
import { deleteTransport } from '../../../components/common/api/transports/delete'
import { getPaymentLink } from '../../../components/common/api/payments/get'

import PaymentData from '../components/payment_data'
import CabinetSwitch from '../components/switch_cabinet'
import CardSwitch from '../components/switch_card'

import { selectErrorInputs } from '../../../constants/input_parsers'

import SerializeForm from '../../../utils/form_serializer'

import './css/driver.css'


function DriverForm(props) {
        return (
            <React.Fragment>
                <p id="warning">
                    Для оказания услуг перевозок на транспорте от 8 мест перевозчик должен обладать
                    лицензией перевозчика или выполнять заказы от компании.
                </p>
                <form className="cabinet__driver__form__driver-info" onSubmit={props.onSubmit} autoComplete="off">
                    <DefaultInput value={props.driver ? props.driver.inn : null} name="inn"  input_type="text" size="25" minLength={10} maxLength={12} placeholder="ИНН"/>
                    <DefaultInput value={props.driver ? props.driver.company_name : null} name="company_name" input_type="text" size="25" placeholder="Наименование Юр.лица, ИП" isRequired={false}/>
                    <DefaultInput value={props.driver ? props.driver.license_number : null} name="license_number" input_type="text" size="25" placeholder="Номер лицензии" isRequired={false}/>
                    <SubmitButton value={props.driver === null ? "Создать" : "Сохранить" }/>
                </form>
            </React.Fragment>           
        )
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
                commission={`${this.props.driver.commission}р`}
                debt={this.props.driver.debt}
                limit={this.props.driver.limit}
                getPaymentLink={this.props.getPaymentLink}
                />
                <p className="cabinet__driver__notify">При достижении суммы коммиссии свыше допустимого лимита подбор заявок будет не доступен</p>
                <div className="cabinet__driver__transports">
                    
                    <p className="cabinet__driver__title">Автопарк</p>
                    {   
                        this.props.transports &&
                        this.props.transports.map(
                            (transport, index) =>
                            <Transport
                            controls="remove"
                            transport={transport}
                            showTransportCard={this.props.showTransportCard}
                            deleteTransport={() => this.props.deleteTransport(index)}
                            />
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
            driver: this.props.driver,
            transports: this.props.transports,
            
            transport_id: null,

            response_text: null,
            notify_type: null,
            error: null
        }

        this.changeForm = this.changeForm.bind(this)
        this.setDriverInfo = this.setDriverInfo.bind(this)
        this.deleteTransport = this.deleteTransport.bind(this)
        this.showTransportCard = this.showTransportCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    changeForm(event) {
        event.preventDefault();

        if (event.target.id === "form") {
            this.setState({
                form: "form",
            })
        } else if (event.target.id === "card"){
            this.setState({
                form: "card",
            }) 
        }
    }

    async setDriverInfo(event, method) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))

        let data = {
            company_name: prepared_data.get("company_name") || null,
            inn: prepared_data.get("inn"),
            license_number: prepared_data.get("license_number") || null
        }

        let response;
        if (method === "POST") {
            response = await createDriver(data)
        } else if (method === "PUT") {
            response = await updateDriver(data)
        }

        if (response.result !== null) {
            if (this.state.error) {
                selectErrorInputs(this.state.error, false)
            }
            this.setState({
                driver: response.result,
                error: null,
                response_text: "Данные успешно изменены",
                notify_type: "success",
            })

            showNotify()
                
            if (method === "POST") {
                this.setState({
                    form: "card"
                })
            }

        } else {
            this.setState({
                error: response.error.message,
                notify_type: "error"
            })

            if (response.error.name === "ValidationError") {
                selectErrorInputs(response.error.message)
                this.setState({
                    response_text: "Не корректно заполнены данные",
                })
            } else {
                this.setState({
                    response_text: response.error.message,
                })
            }
            showNotify()
        }
    }

    async deleteTransport(index_array) {
        let transport = this.state.transports[index_array]
        
        let response = await deleteTransport(transport.id)
        if (response.result !== null) {
            let transports = this.state.transports
            transports.splice(index_array, 1)

            this.setState({
                transports: transports,

                response_text: "Транспорт успешно удален",
                notify_type: "success",
                error: null
            })
            showNotify()
        } else {
            this.setState({
                error: response.error.message,
                response_text: response.error.message,
                notify_type: "error"
            })
            showNotify() 
        }
    }

    getPaymentLink = async() => {
        let response = await getPaymentLink("personal")
        
        if (response.result !== null) {
            window.location.replace(response.result.payment_url)
        
        } else {
            this.setState({
                error: response.error.message,
                notify_type: "error",
                
                response_text: response.error.message,
            })
            showNotify()
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                driver: this.props.driver,
                transports: this.props.transports
            })
        }
    }

    render() {
        let form;

        if (this.state.form === "card") {
            form = <DriverCard 
            getPaymentLink={this.getPaymentLink}
            deleteTransport={this.deleteTransport}
            showTransportCard={this.showTransportCard}
            driver={this.state.driver}
            transports={this.state.transports}
            />

        } else if (this.state.form === "form") {
            let method = this.state.driver === null ? "POST" : "PUT"
            
            form = <DriverForm
            driver={this.state.driver}
            onSubmit={(e) => this.setDriverInfo(e, method)}
            />
        }
        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />

                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }

                <div className={"container cabinet driver " + this.state.form}>
                    <CabinetSwitch is_active="driver" onClick={this.props.changeForm}/>
                    <CardSwitch is_active={this.state.form} isDisable={this.state.driver === null ? true : false} onClick={this.changeForm}/>
                    {form}
                </div>

            </React.Fragment>
            
        )
    }
}


