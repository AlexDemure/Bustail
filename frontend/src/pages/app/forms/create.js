import React from 'react'

import Notify from '../../../components/common/notify'
import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'
import sendRequest from '../../../utils/fetch'

import { appTypes } from '../../../constants/app_types'
import { getCities } from '../../../constants/cities'


function MainFormCreateApp(props) {
    return (
        <form className="create-app__form__main" onSubmit={props.onSubmit}>
            <SearchInput name="application_type" placeholder="Тип услуги" options={props.app_types}/>
            <SearchInput name="to_go_from" placeholder="Откуда" options={props.cities}/>
            <SearchInput name="to_go_to" placeholder="Куда" options={props.cities}/>
            <DefaultInput name="to_go_when" input_type="date" size="25" placeholder="Дата поездки (дд.мм.гггг)"/>
            <DefaultInput name="count_seats" input_type="number" size="25" placeholder="Пассажиров"/>
            <SubmitButton value="Далее"/>
        </form>
    )
}

function AdditionalFormCreateApp(props) {
    return (
        <form className="create-app__form__additional" onSubmit={props.onSubmit}>
            <TextAreaInput name="description" rows="5" placeholder="Комментарий"/>
            <DefaultInput name="price" input_type="number" size="25" placeholder="Стоимость к заказу"/>
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
                to_go_from: null,
                to_go_to: null,
                to_go_when: null,
                count_seats: 0,
                description: null,
                price: 0,
                application_type: null
            }
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

         this.setState({
            form: "additional",

            app_data: {
                application_type: application_type || null,
                to_go_from: prepared_data.get("to_go_from"),
                to_go_to: prepared_data.get("to_go_to"),
                to_go_when: new Date(prepared_data.get("to_go_when").replace(date_pattern,'$3-$2-$1')).toISOString().slice(0,10),
                count_seats: parseInt(prepared_data.get("count_seats")),
            }
        })
    }

    additionalCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        let data = this.state.app_data

        data.price = parseInt(prepared_data.get("price"))
        data.description = prepared_data.get("description") !== "" ? prepared_data.get("description") : null

        console.log(data)

        sendRequest('/api/v1/applications/', "POST", data)
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    form: "notify"
                })
            },
            (error) => {
                console.log(error.message);
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
                {form}
            </React.Fragment>
        )
    }
}