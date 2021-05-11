import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import DragAndDrop from '../../../components/common/drag_and_drop'

import { uploadFile } from '../../../utils/upload_file'

import './css/form_contacts.css'


function FeedBackForm(props) {
    return (
        <React.Fragment>
            <div className="contacts__title">
                <p id="email">Email: <span>support@bustail.online</span></p>
                <a href="tel:+79191231251" id="phone">Телефон: <span>+7 (351) 223-12-51</span></a>
            </div>
            <form className="contacts__form__feedback" onSubmit={props.onSubmit}>
                <p>Форма обратной связи</p>
                <DefaultInput name="email" input_type="email" size="25" placeholder="Электронная почта"/>
                <TextAreaInput name="text" rows="5" placeholder="Текст сообщения"/>
                <DragAndDrop saveFile={props.saveFile}/>
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
        this.saveFile = this.saveFile.bind(this)
    }

    saveFile(file, isUploaded) {
        this.setState({
            isUploaded: isUploaded,
            file: file,
        })
    }

    sendMessage(event) {
        event.preventDefault();

        let btn = document.getElementsByClassName('input__common__submit')[0]
        btn.disabled = true

        let url = `/api/v1/mailing/feedback/`
        let data  = new FormData(event.target);

        if (this.state.file) {
            data.append("file", this.state.file, this.state.file.name)
        }
        
        uploadFile(url, data)
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    form: "notify"
                })
            },
            (error) => {
                console.log(error.message)
                btn.disabled = false
            }
        )
    }
    render() {
        let form;
        if (this.state.form === "notify") {
            form = <FeedBackNotify/>
        }else {
            form = <FeedBackForm saveFile={this.saveFile} onSubmit={this.sendMessage}/>
        }
        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    
    }
}
