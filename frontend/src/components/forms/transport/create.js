import React from 'react'
import '../css/base.css'

import Notify from '../../common/notify'

import SerializeForm from '../../../utils/form_serializer'

import DefaultInput from '../../common/inputs/default'
import SearchInput from '../../common/inputs/search_selector'
import TextAreaInput from '../../common/inputs/textarea'

import SendFormBtn from '../../common/buttons/send_form_btn'




function MainFormCreateTransport(props) {
    return (
        <form className="form_create_transport" onSubmit={props.onSubmit}>
            <SearchInput name="city" placeholder="Город" options={props.cities}/>
            
            <DefaultInput name="mark" input_type="text" size="25" placeholder="Марка"/>
            <DefaultInput name="model" input_type="text" size="25" placeholder="Модель"/>
            <DefaultInput name="seats" input_type="number" size="12" placeholder="Пассажиров"/>
            <DefaultInput name="gos_number" input_type="text" size="12" placeholder="Гос номер"/>
            <SendFormBtn value="Далее"/>
        </form>
    )
}

function AdditionalFormCreateTransport(props) {
    return (
        <form className="form_additional_info" onSubmit={props.onSubmit}>
            <TextAreaInput name="description" rows="5" placeholder="Описание автомобиля"/>
            <DefaultInput name="price" input_type="number" size="25" placeholder="Стоимость (в час)"/>
            <SendFormBtn value="Далее"/>
        </form>
    )
}

function ImageFormCreateTransport(props) {
    return (
        <form className="form_additional_info" onSubmit={props.onSubmit}>
            <DefaultInput name="cover" input_type="file" placeholder="Обложка автомобиля"/>
            <SendFormBtn value="Создать"/>
        </form>
    )
}

export default class CreateTransportForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            form: "main",
        };
        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
        this.coverCard = this.coverCard.bind(this);
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
            form: "cover",
        })

        // TODO FETCH
    }

    coverCard(event) {
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
            form = <Notify type="create_transport" link="/cabinet" text="Личный кабинет"/>
        }else if (this.state.form === "cover") {
            form = <ImageFormCreateTransport onSubmit={this.coverCard}/>
        }else if (this.state.form === "additional") {
            form = <AdditionalFormCreateTransport onSubmit={this.additionalCard}/>
        }else{
            form = <MainFormCreateTransport
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