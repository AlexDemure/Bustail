import React from 'react'

import Header from '../../components/common/header'

import ContactsPage from './contacts'

import './css/index.css'

function PreviewPage(props) {
    return (
        <div className="preview page">
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
            <div className="about__title">
                <p id="header">Bustail</p>
                <p id="description">сервис пассажирских перевозок</p>
                <p id="info">
                Сервис осуществляет агрегацию заявок на перевозки от клиентов и предложения аренды транспорта от водителей по всей России. <br/>
                Целью сервиса является создать централизированное место для оказания услуг в этой сфере без посредников с максимальной прозрачностью.
                </p>
            </div>
            <div className="about__video">
                <p>Как пользоваться сервисом?</p>
                <iframe
                    src="https://www.youtube.com/embed/5qap5aO4i9A">
                </iframe>
            </div>
            <div className="about__footer">
                <div id="faq-btn" className="anchor" onClick={props.changeForm}>Вопросы и ответы</div>
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
            </div>
        </div>
    )
}

class FaqPage extends React.Component {
    constructor(props) {
        super(props)
    }

    clickAccordion = (e) => {
        let panel = e.target.nextElementSibling
        if (panel.style.display === "block") {
            panel.style.display = "none";
        } else {
        panel.style.display = "block";
        }    
    }

    render() {
        return (
            <div className="faq page">
                <div className="faq__title">
                    <p id="header">Часто задаваемые вопросы</p>
                    <p id="info">
                        Если вы не нашли ответ на свой вопрос вы всегда можете написать в поддержу support@bustail.com
                    </p>
                </div>
                <div className="faq__questions">
                    <button onClick={this.clickAccordion} className="faq__accordion">Осуществляет ли сервис деятельность перевозчика?</button>
                    <div className="faq__panel">
                        <p>На данный момент сервис не осуществляет такую деятельность. Но агрегирует заявки между перевозчиками.</p>
                    </div>
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Я водилетель и хочу зарабатывать в вашем сервисе что необходимо для этого?</button>
                    <div className="faq__panel">
                        <p>Для этого необходимо:</p>
                        <ul>
                            <li>- Зарегестироваться на нашем сервисе</li>
                            <li>- Создать карточку водителя и транспорта</li>
                            <li>- Ожидать предложения от клиента или искать заявки самостоятельно</li>
                        </ul>
                    </div> 
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Для чего нужен этот сервис?</button>
                    <div className="faq__panel">
                        <p>Сервис предназначен для оказания услуг в сфере пассажирских перевозок без посредником с прозрачностью для клиентов сервиса.</p>
                    </div> 
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Платный ли сервис?</button>
                    <div className="faq__panel">
                        <p>Сервис бесплатный. Для водителей осуществляется система коммиссий за выполненный заказ.</p>
                    </div> 
                </div>
                <div className="faq__footer">
                    <div id="contacts-btn" className="anchor" onClick={this.props.changeForm}>Контакты</div>
                    <div id="preview-btn" className="anchor" onClick={this.props.changeForm}></div>
                </div>
            </div>
        )
    }
    
}



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
            <div className="container landing">
                <Header page_name={this.state.page_name}/>
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

