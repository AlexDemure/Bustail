
import './css/base.css'
import './css/preview.css'


export default function PreviewPage(props) {
    return (
        <div className="preview page">
            <div className="preview__title">
                <h1 id="name">Bustail</h1>
                <h2 id="description">
                    сервис пассажирских перевозок
                </h2>
            </div>
            <div className="preview__btns">
                <div id="login-btn" onClick={() => window.location.replace('/login')}>
                    <p>В приложение</p>
                </div>
                <div id="socials">
                    <div id="vk" onClick={() => window.location.replace('https://vk.com/bustail')}></div>
                    <div id="youtube" onClick={() => window.location.replace('https://www.youtube.com/channel/UCuSfwVO7usNuBj6XzHd7iPw')}></div>
                    <div id="instagram" onClick={() => window.location.replace('https://www.instagram.com/_bustail/')}></div>
                </div>
                <div id="pwa-btn" onClick={() => window.location.replace('https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ru&oco=1')}>
                    <p>Как установить приложение?</p>
                </div>
            </div>
            <div className="footer">
                <div id="about-btn" className="anchor" onClick={props.changeForm}>О сервисе</div>
                <div id="contacts-btn" className="anchor" onClick={props.changeForm}>Контакты</div>
            </div>
        </div>
    )
}
