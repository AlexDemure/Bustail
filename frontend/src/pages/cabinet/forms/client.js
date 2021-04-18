import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import SubmitButton from '../../../components/common/buttons/submit_btn'


export default class ClientInfoForm extends React.Component {
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
                    <DefaultInput value={this.props.user.phone} name="phone" input_type="text" size="25" placeholder="Телефон"/>
                    <SubmitButton value="Сохранить"/>
                </form>
            </React.Fragment>
           
        )
    }
}