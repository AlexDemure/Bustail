import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import TransportCard from '../../../components/common/transport_card'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import PaymentData from '../components/payment_data'
import TransportCabinet from '../components/transport'
import CabinetSwitch from '../components/switch_cabinet'
import CardSwitch from '../components/switch_card'

import { selectErrorInputs } from '../../../constants/input_parsers'

import sendRequest from '../../../utils/fetch'
import SerializeForm from '../../../utils/form_serializer'

import './css/company.css'


function CompanyForm(props) {
    return (
        <React.Fragment>
            <p id="warning">
                Для оказания услуг перевозок компания должна обладать
                лицензией перевозчика.
            </p>
            <form className="cabinet__company__form__company-info" onSubmit={props.onSubmit} autoComplete="off">
                <DefaultInput value={props.company ? props.company.inn : null} name="inn" input_type="text" size="25" minLength={12} maxLength={12} placeholder="ИНН"/>
                <DefaultInput value={props.company ? props.company.ogrn : null} name="ogrn" input_type="text" size="25" minLength={13} maxLength={15} placeholder="ОГРН"/>
                <DefaultInput value={props.company ? props.company.company_name : null} name="company_name" input_type="text" size="25" placeholder="Наименование Юр.лица, ИП"/>
                <DefaultInput value={props.company ? props.company.license_number : null} name="license_number" input_type="text" size="25" placeholder="Номер лицензии"/>
                <DefaultInput value={props.company ? props.company.page_url : null} name="page_url" input_type="text" size="64" minLength={6} maxLength={64} placeholder="Название страницы на англ." isRequired={false} pattern={"[a-zA-Z\d]*"}/>
                <DefaultInput value={props.company && props.company.socials ? props.company.socials.vk : null} name="vk" minLength={1} maxLength={64} input_type="text" size="64" placeholder="Группа в Вконтакте" isRequired={false}/>
                <DefaultInput value={props.company && props.company.socials ? props.company.socials.instagram : null} minLength={1} maxLength={64} name="instagram" input_type="text" size="64"  placeholder="Страница в Инстаграм" isRequired={false}/>
                <SubmitButton value={props.company === null ? "Создать" : "Сохранить" }/>
            </form>
        </React.Fragment> 
    )
}


class CompanyCard extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="cabinet__company"> 
                <PaymentData
                total={this.props.company.total_amount}
                commission={`${this.props.company.commission}р`}
                debt={this.props.company.debt}
                limit={this.props.company.limit}
                getPaymentLink={this.props.getPaymentLink}
                />
                <p className="cabinet__company__notify">При достижении суммы коммиссии свыше допустимого лимита подбор заявок будет не доступен</p>
                <div className="cabinet__company__transports">
                    
                    <p className="cabinet__company__title">Автопарк</p>
                    {   
                        this.props.transports &&
                        this.props.transports.map(
                            (transport, index) =>
                            <TransportCabinet
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

export default class CompanyPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            form: "form",

            company: this.props.company,
            transports: this.props.transports,
            
            transport_id: null,

            response_text: null,
            notify_type: null,
            error: null
        }

        this.changeForm = this.changeForm.bind(this)
        this.setCompanyInfo = this.setCompanyInfo.bind(this)
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

    setCompanyInfo(event, method) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))

        let data = {
            company_name: prepared_data.get("company_name"),
            inn: prepared_data.get("inn"),
            ogrn: prepared_data.get("ogrn"),
            license_number: prepared_data.get("license_number"),
            page_url: prepared_data.get("page_url") || null,
            socials: {
                vk: prepared_data.get("vk"),
                instagram: prepared_data.get("instagram") || null
            }
        }
        sendRequest('/api/v1/company/', method, data)
        .then(
            (result) => {
                if (this.state.error) {
                    selectErrorInputs(this.state.error, false)
                }
                this.setState({
                    company: {
                        id: result.id,
                        account_id: result.account_id,

                        license_number: result.license_number,
                        inn: result.inn,
                        ogrn: result.ogrn,
                        company_name: result.company_name,
                        socials: result.socials,
                        page_url: result.page_url,

                        transports: result.transports,
                        
                        total_amount: result.total_amount,
                        commission: result.commission,
                        debt: result.debt,
                        limit: result.limit
                    },
                    error: null,
                    response_text: "Данные успешно изменены",
                    notify_type: "success",
                })
                showNotify()
            },
            (error) => {
                this.setState({
                    error: error.message,
                    notify_type: "error"
                })

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                    this.setState({
                        response_text: "Не корректно заполнены данные",
                    })
                } else {
                    this.setState({
                        response_text: error.message,
                    })
                }
                showNotify()
            }
        )
    }
    
    deleteTransport(index_array) {
        sendRequest(`api/v1/drivers/transports/${this.state.transports[index_array].id}/`, "DELETE")
        .then(
            (result) => {
                console.log(result)
                let transports = this.state.transports
                transports.splice(index_array, 1)

                this.setState({
                    transports: transports,

                    response_text: "Транспорт успешно удален",
                    notify_type: "success",
                    error: null
                })
                showNotify()
            },
            (error) => {
                console.log(error)
                this.setState({
                    error: error.message,
                    response_text: error.message,
                    notify_type: "error"
                })
                showNotify()
            }
        )
    }

    getPaymentLink = () => {
        sendRequest("/api/v1/payments/", "GET")
        .then(
            (result) => {
                window.location.replace(result.payment_url)
            },
            (error) => {
                console.log(error.message)
                this.setState({
                    error: error.message,
                    notify_type: "error",
                    response_text: error.message,
                })
                showNotify()
            }
        )    
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                company: this.props.company,
                transports: this.props.transports
            })
        }
    }

    render() {
        let form;

        if (this.state.form === "card") {
            form = <CompanyCard 
            getPaymentLink={this.getPaymentLink}
            deleteTransport={this.deleteTransport}
            showTransportCard={this.showTransportCard}
            company={this.state.company}
            transports={this.state.transports}
            />

        } else if (this.state.form === "form") {
            let method = this.state.company === null ? "POST" : "PUT"

            form = <CompanyForm
            company={this.state.company}
            onSubmit={(e) => this.setCompanyInfo(e, method)}
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

                <div className={"container cabinet company " + this.state.form}>
                    <CabinetSwitch is_active="company" onClick={this.props.changeForm}/>
                    <CardSwitch is_active={this.state.form} isDisable={this.state.company === null ? true : false} onClick={this.changeForm}/>
                    {form}
                </div>

            </React.Fragment>
            
        )
    }
}


