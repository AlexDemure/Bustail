import React from 'react'

import SerializeForm from '../../../utils/form_serializer'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import SubmitButton from '../../../components/common/buttons/submit_btn'


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
                <form className="cabinet__form__client-info" onSubmit={this.changeInfo}>
                    <SearchInput name="city" placeholder="Город" options={this.props.cities}/>
                    <DefaultInput name="email" input_type="email" size="25" placeholder="Почта"/>
                    <DefaultInput name="phone" input_type="text" size="25" placeholder="Телефон"/>
                    <SubmitButton value="Сохранить"/>
                </form>
            </React.Fragment>
           
        )
    }
}