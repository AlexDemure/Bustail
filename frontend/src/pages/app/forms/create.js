import React from 'react'
import '../css/base.css'

import Notify from '../../../components/common/notify'

import SerializeForm from '../../../utils/form_serializer'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import TextAreaInput from '../../../components/common/inputs/textarea'

import SubmitButton from '../../../components/common/buttons/submit_btn'


function MainFormCreateApp(props) {
    return (
        <form className="form_create_app" onSubmit={props.onSubmit}>
            <SearchInput name="app_type" placeholder="Тип услуги" options={props.app_types}/>
            <SearchInput name="from" placeholder="Откуда" options={props.cities}/>
            <SearchInput name="to" placeholder="Куда" options={props.cities}/>
            <DefaultInput name="date" input_type="date" size="25" placeholder="Дата поездки"/>
            <DefaultInput name="seats" input_type="number" size="25" placeholder="Пассажиров"/>
            <SubmitButton value="Далее"/>
        </form>
    )
}

function AdditionalFormCreateApp(props) {
    return (
        <form className="form_additional_info" onSubmit={props.onSubmit}>
            <TextAreaInput name="comment" rows="5" placeholder="Комментарий"/>
            <DefaultInput name="price" input_type="number" size="25" placeholder="Стоимость к заказу"/>
            <SubmitButton value="Создать"/>
        </form>
    )
}


export default class CreateAppForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: "main",
        };
        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
    }

    mainCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        this.setState({
            form: "additional",
        })

        // TODO FETCH
    }

    additionalCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        this.setState({
            form: "notify",
        })

        // TODO FETCH
    }


    render() {
        let form;

        if (this.state.form === "notify") {
            form = <Notify type="create_app" link="/cabinet" text="Личный кабинет"/>
        }else if (this.state.form === "additional") {
            form = <AdditionalFormCreateApp onSubmit={this.additionalCard}/>
        }else{
            form = <MainFormCreateApp
            app_types={this.props.app_types}
            cities={this.props.cities}
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