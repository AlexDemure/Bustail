
import './css/base.css'
import './css/about.css'


export default function AboutPage(props) {
    return (
        <div className="about page">
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
                    src="https://www.youtube.com/embed/QjECdVpEmKg">
                </iframe>
            </div>
            <div className="footer">
                <div id="faq-btn" className="anchor" onClick={props.changeForm}>Вопросы и ответы</div>
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
            </div>
        </div>
    )
}