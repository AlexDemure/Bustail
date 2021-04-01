import React from 'react'

import './css/client.css'

import SerializeForm from '../../../utils/form_serializer'

import DefaultInput from '../../common/inputs/default'
import SearchInput from '../../common/inputs/search_selector'

import SendFormBtn from '../../common/buttons/send_form_btn'


export default class ClientInfoForm extends React.Component {
    constructor(props) {
        super(props);
        
        this.changeInfo = this.changeInfo.bind(this)
    }

    changeInfo(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        console.log(prepared_data);

        
        // TODO FETCH
    }

    render() {
        return (
            <React.Fragment>
                <p id="warning">Сервис не несет ответственность за качество оказания услуг или спорных ситуаций при выполнении заказов.</p>
                <form className="form_client_info" onSubmit={this.changeInfo}>
                    <SearchInput name="city" placeholder="Город" options={this.props.cities}/>
                    <DefaultInput name="email" input_type="email" size="25" placeholder="Почта"/>
                    <DefaultInput name="phone" input_type="text" size="25" placeholder="Телефон"/>
                    <SendFormBtn value="Сохранить"/>
                </form>
            </React.Fragment>
           
        )
    }
}