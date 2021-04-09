import React from 'react'
import './css/main.css'

import Header from '../../components/common/header'


function PreviewPage(props) {
    return (
        <div className="preview page">
            <Header/>
            <div className="preview__title">
                <p id="name">Bustail</p>
                <p id="description">
                    сервис пассажирских перевозок
                </p>
            </div>
            <div className="preview__btns">
                <div id="login-btn" onClick={() => window.location.replace('/login')}>
                    <p>Веб-приложение</p>
                </div>
                <div id="pwa-btn">
                    <p>Установить</p>
                </div>
            </div>
            <div className="preview__footer">
                <div id="about-btn" className="anchor" onClick={props.changeForm}>О сервисе</div>
                <div id="contacts-btn" className="anchor" onClick={props.changeForm}>Контакты</div>
            </div>
        </div>
    )
}

function AboutPage(props) {
    return (
        <div className="about page" onClick={props.changeForm}>

        </div>
    )
}

function FaqPage() {
    return (
        <div className="faq page" onClick={() => window.location.hash='contacts'}>3</div>
    )
}

function ContactsPage() {
    return (
        <div className="contacts page" onClick={() => window.location.hash='preview'}>4</div>
    )
}

export default class LangingPage extends React.Component {
    constructor() {
        super()
        this.state = {
            form: "preview"
        }
        this.changeForm = this.changeForm.bind(this);
    }

    changeForm(e) {
        let form_type;

        if (e.target.id === "about-btn") {
            form_type = "about"
        } else if (e.target.id === "faq-btn") {
            form_type = "faq"
        } else if (e.target.id === "contacts-btn") {
            form_type = "contacts"
        } else {
            form_type = "preview"
        }

        this.setState({
            form: form_type
        })
    }

    render() {
        return (
            <div className="container landing">
                {
                    this.state.form === "preview" && <PreviewPage changeForm={this.changeForm}/>
                }
                {
                    this.state.form === "about" && <AboutPage changeForm={this.changeForm}/>
                }
                {
                    this.state.form === "faq" && <FaqPage changeForm={this.changeForm}/>
                }
                {
                    this.state.form === "contacts" && <ContactsPage changeForm={this.changeForm}/>
                }
            </div>
        )
    }
    
}

