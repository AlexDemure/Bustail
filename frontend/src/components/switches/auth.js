import './css/auth.css'
import './css/base.css'
import './css/inline.css'

function AuthSwitch(props) {
    return (
        <div className="switch inline auth">
            <p className={`switch__item ${ props.is_active === 'reg' ? "active" : "no-active"}`}>
                <a href="/registration">Регистрация</a>
            </p>
            <p className="switch__item" id="v-line">|</p>
            <p className={`switch__item ${ props.is_active === 'login' ? "active" : "no-active"}`}>
                <a href="/login">Вход</a>
            </p>
        </div>
    )
}

export default AuthSwitch
