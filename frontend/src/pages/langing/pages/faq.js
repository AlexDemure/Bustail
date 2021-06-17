import React from 'react'

import './css/base.css'
import './css/faq.css'


export default class FaqPage extends React.Component {
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
                        Если вы не нашли ответ на свой вопрос вы всегда можете написать в поддержу support@bustail.online
                    </p>
                </div>
                <div className="faq__questions">
                    <button onClick={this.clickAccordion} className="faq__accordion">Осуществляет ли сервис деятельность перевозчика?</button>
                    <div className="faq__panel">
                        <p>На данный момент сервис не осуществляет такую деятельность, uо агрегирует заявки между другими перевозчиками по всей России.</p>
                    </div>
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Я водилетель и хочу зарабатывать в вашем сервисе что необходимо для этого?</button>
                    <div className="faq__panel">
                        <p>Для этого необходимо:</p>
                        <ul>
                            <li>- Зарегестироваться на нашем сервисе</li>
                            <li>- Создать карточку водителя и транспорта</li>
                            <li>- Ожидать предложения от клиентов либо искать заявки самостоятельно в "Поиске заявок"</li>
                        </ul>
                    </div> 
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Для чего нужен этот сервис?</button>
                    <div className="faq__panel">
                        <p>
                            Сервис движется в сторону объеденения клиентов и перевозчиков в одном месте с прозрачной формой работы для каждой из сторон.
                            Для клиентов мы предоставляем самостоятельный выбор перевозчика а водителям самостоятельный выбор заявок.
                        </p>
                    </div> 
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Платный ли сервис?</button>
                    <div className="faq__panel">
                        <p>Использования всех возможностей системы бесплатно.</p>
                    </div> 
                </div>
                <div className="footer">
                    <div id="contacts-btn" className="anchor" onClick={this.props.changeForm}>Контакты</div>
                    <div id="preview-btn" className="anchor" onClick={this.props.changeForm}></div>
                </div>
            </div>
        )
    }
    
}