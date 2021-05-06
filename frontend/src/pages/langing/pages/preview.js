
import './css/base.css'
import './css/preview.css'


export default function PreviewPage(props) {
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
                    <p>В приложение3</p>
                </div>
                <div id="pwa-btn" onClick={() => window.location.replace('https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ru&oco=1')}>
                    <p>Как установить</p>
                </div>
            </div>
            <div className="footer">
                <div id="about-btn" className="anchor" onClick={props.changeForm}>О сервисе</div>
                <div id="contacts-btn" className="anchor" onClick={props.changeForm}>Контакты</div>
            </div>
        </div>
    )
}
