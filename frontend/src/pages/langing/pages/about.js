
import './css/base.css'
import './css/about.css'


export default function AboutPage(props) {
    return (
        <div className="about page">
            <div className="about__title">
                <p id="header">Bustail</p>
                <p id="description">сервис пассажирских перевозок</p>
                <p id="info">
                На данный момент мы занимаемся агрегацией заявок в сфере пассажирских перевозок по всей России.<br/>
                Мы помогаем клиентам найти подходящий для них транспорт а перевозчикам зарабатывать.<br/>
                Наша цель стать сервисом который будет объеденять всех перевозчиков и клиентов в одном месте.
                </p>
            </div>
            <div className="about__video">
                <p>Как пользоваться сервисом?</p>
                <iframe title="bustail intro"
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