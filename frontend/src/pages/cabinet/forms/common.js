import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import InputPhone from '../../../components/common/inputs/phone'

import SubmitButton from '../../../components/common/buttons/submit_btn'
import CabinetSwitch from '../components/switch_cabinet'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'

import { selectErrorInputs } from '../../../constants/input_parsers'

class CommonInfoForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <p id="warning">Сервис не несет ответственность за качество оказания услуг или спорных ситуаций при выполнении заказов.</p>
                <form className="cabinet__form__client-info" onSubmit={this.props.changeInfo} autoComplete="off">
                    <SearchInput value={this.props.user.city} name="city" placeholder="Город" options={this.props.cities}/>
                    <DefaultInput value={this.props.user.email} name="email" input_type="email" size="25" placeholder="Почта" readOnly={true}/>
                    <DefaultInput value={this.props.user.fullname} name="fullname" input_type="text" size="25" placeholder="ФИО"/>
                    <InputPhone value={this.props.user.phone}/>
                    <SubmitButton value="Сохранить"/>
                </form>
            </React.Fragment>
        )
    }
}


export default class CommonPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

            user: props.user,
            cities: props.cities,

            response_text: null,
            notify_type: null,
            error: null
        };
        this.changeInfo = this.changeInfo.bind(this)
    }

    changeInfo(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))

        let data = {
            phone: prepared_data.get("phone"),
            fullname: prepared_data.get("fullname"),
            city: prepared_data.get("city")
        }
        sendRequest('/api/v1/accounts/', "PUT", data)
        .then(
            (result) => {
                if (this.state.error) {
                    selectErrorInputs(this.state.error, false)
                    this.setState({
                        error: null
                    })
                }
                this.setState({
                    response_text: "Данные успешно изменены",
                    notify_type: "success",
                })
                showNotify()
                this.props.changeInfo(data)
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

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                user: this.props.user,
                cities: this.props.cities
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />

                <div className="container cabinet common">
                    <CabinetSwitch is_active="common" onClick={this.props.changeForm}/>
                    <CommonInfoForm changeInfo={this.changeInfo} user={this.state.user} cities={this.state.cities}/>
                </div>
                
            </React.Fragment>
            
        )
    }
}