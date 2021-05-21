import React from 'react'

import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import InputDate from '../../../components/common/inputs/datepicker'

import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import NavBar from '../../../components/common/navbar'
import Header from '../../../components/common/header'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'

import { appTypes } from '../../../constants/app_types'
import { getCities } from '../../../constants/cities'
import { selectErrorInputs } from '../../../constants/input_parsers'


function MainFormCreateApp(props) {
    return (
        <form className="create-app__form__main" onSubmit={props.onSubmit} autoComplete="off">
            <SearchInput name="application_type" placeholder="Тип услуги" options={props.app_types}/>
            <SearchInput name="to_go_from" placeholder="Откуда" options={props.cities}/>
            <SearchInput name="to_go_to" placeholder="Куда" options={props.cities}/>
            <InputDate name="to_go_when"/>
            <DefaultInput name="count_seats" maxLength={4} input_type="number" size="4" placeholder="Пассажиров"/>
            <SubmitButton value="Далее"/>
        </form>
    )
}

function AdditionalFormCreateApp(props) {
    return (
        <form className="create-app__form__additional" onSubmit={props.onSubmit}>
            <TextAreaInput name="description" size="5" placeholder="Комментарий или детали заказа" isRequired={false}/>
            <DefaultInput name="price" input_type="number" maxLength={7} size="7" placeholder="Стоимость" isRequired={false}/>
            <SubmitButton value="Создать"/>
        </form>
    )
}


export default class CreateAppForm extends React.Component {

    constructor() {
        super();
        
        this.state = {
            form: "main",
            
            cities: [],
            app_types: {}, // Список типов заявок в формате {key:value, key:value}
            app_types_list: [], // Список типов заявок для SearhInput [value, value]

            app_data: {
                id: null
            },

            response_text: null,
            notify_type: null,
            error: null
        };

        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
    }

    mainCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        let app_types = this.state.app_types
        let date_pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        let application_type;

        Object.keys(app_types).forEach(
            function(key) {
                if (app_types[key] === prepared_data.get("application_type")) {
                    application_type = key
                }
            }
         );
        
         let data = {
            application_type: application_type || null,
            to_go_from: prepared_data.get("to_go_from"),
            to_go_to: prepared_data.get("to_go_to"),
            to_go_when: new Date(prepared_data.get("to_go_when").replace(date_pattern,'$3-$2-$1')).toISOString().slice(0,10),
            count_seats: parseInt(prepared_data.get("count_seats")),
        }

        sendRequest('/api/v1/applications/', "POST", data)
        .then(
            (result) => {
                if (this.state.error) {
                    selectErrorInputs(this.state.error, false)
                    this.setState({error: null})
                }

                this.setState({
                    form: "additional",
                    app_data: {
                        id: result.id
                    }
                })
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

    additionalCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))

        let data = {
            price: prepared_data.get("price") !== "" ? parseInt(prepared_data.get("price")) : 0,
            description: prepared_data.get("description") !== "" ? prepared_data.get("description") : null
        }
 
        sendRequest(`/api/v1/applications/${this.state.app_data.id}/`, "PUT", data)
        .then(
            (result) => {
                this.setState({form: "notify"})
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

    async componentDidMount(){
        let cities = await getCities()
        let app_types = await appTypes()
        let app_types_list = [] // Формирование в стиле [] для SearchInput

        Object.keys(app_types).forEach(
            function(key) {
                app_types_list.push(app_types[key])
            }
         );

        
        this.setState(
            {
                cities: cities,
                app_types: app_types,
                app_types_list: app_types_list,
            }
        );
    }

    render() {
        let form;
       
        
        if (this.state.form === "notify") {
            form = <Notify type="create_app" link="/cabinet" text="Личный кабинет"/>
        }else if (this.state.form === "additional") {
            form = <AdditionalFormCreateApp onSubmit={this.additionalCard}/>
        }else{
            form = <MainFormCreateApp
            app_types={this.state.app_types_list}
            cities={this.state.cities}
            onSubmit={this.mainCard}
            />
        }

        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />

                <Header previous_page="/main" page_name="Создание заявки"/>
                    
                    <div className="container create-app">
                        {form}
                    </div>
                
                <NavBar/>
            </React.Fragment>
        )
    }
}