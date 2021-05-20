import React from 'react'

import Header from '../../components/common/header'

import PreviewPage from './pages/preview'
import AboutPage from './pages/about'
import FaqPage from './pages/faq'
import ContactsPage from './pages/contacts'


export default class LangingPage extends React.Component {
    constructor() {
        super()
        this.state = {
            form: "preview",
            page_name: ""
        }
        this.changeForm = this.changeForm.bind(this);
    }

    changeForm(e) {
        let form_type;
        let page_name;

        if (e.target.id === "about-btn") {
            form_type = "about"
            page_name = "О сервисе"
        } else if (e.target.id === "faq-btn") {
            form_type = "faq"
            page_name = "Вопросы"
        } else if (e.target.id === "contacts-btn") {
            form_type = "contacts"
            page_name = "Контакты"
        } else {
            form_type = "preview"
            page_name = ""
        }

        this.setState({
            form: form_type,
            page_name: page_name
        })
    }

    render() {
        return (
            <React.Fragment>
                <Header page_name={this.state.page_name}/>
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
            </React.Fragment>
        )
    }
    
}

