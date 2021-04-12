import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'

import SerializeForm from '../../../utils/form_serializer'

import './css/form_contacts.css'

function FeedBackForm(props) {
    return (
        <React.Fragment>
            <div className="contacts__title">
                <p id="email">Email: <span>bustail@support.com</span></p>
                <a href="tel:+79191231251" id="phone">Телефон: <span>+7 (351) 223-12-51</span></a>
            </div>
            <form className="contacts__form__feedback" onSubmit={props.onSubmit}>
                <p>Форма обратной связи</p>
                <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
                <TextAreaInput name="description" rows="5" placeholder="Текст сообщения"/>
                <DefaultInput name="cover" input_type="file" placeholder="Файл (опционально)"/>
                <SubmitButton value="Отправить"/>
            </form>
        </React.Fragment>
        
    )
}


function FeedBackNotify() {
    return (
        <React.Fragment>
            <div className="contacts__notify">
                <p>Спасибо за обратную связь. <br/> С вами свяжется оператор в ближайшее время.</p>
            </div>
        </React.Fragment>
    )
}

export default class ContactsFeedBackForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            form: "contacts"
        }
        this.sendMessage = this.sendMessage.bind(this)
    }

    sendMessage(event) {
        event.preventDefault();
        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        this.setState({
            form: "notify"
        })
        console.log(prepared_data);

        // TODO FETCH
    }
    render() {
        let form;
        if (this.state.form === "notify") {
            form = <FeedBackNotify/>
        }else {
            form = <FeedBackForm onSubmit={this.sendMessage}/>
        }
        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    
    }
}
