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
                        <p>На данный момент сервис не осуществляет такую деятельность. Но агрегирует заявки между другими перевозчиками по всей России.</p>
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
                            Сервис предназначен для оказания услуг в сфере пассажирских перевозок без посредником с прозрачностью для клиентов сервиса.
                            Клиенты напрямую сотрудничают с перевозчиками. В дальнейшем будем подключать возможность регистрации проверенных компаний-перевозчиков.
                        </p>
                    </div> 
    
                    <button onClick={this.clickAccordion} className="faq__accordion">Платный ли сервис?</button>
                    <div className="faq__panel">
                        <p>Сервис бесплатный. Для водителей осуществляется система коммиссий за выполненный заказ.</p>
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