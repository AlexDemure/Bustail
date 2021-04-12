import './css/base.css'


function AuthSwitch(props) {
    return (
        <div className="switch__authorization">
            <p className={`switch__authorization__item ${ props.is_active === 'reg' ? "active" : "no-active"}`}>
                <a href="/registration">Регистрация</a>
            </p>
            <p className="switch__authorization__item" id="v-line">|</p>
            <p className={`switch__authorization__item ${ props.is_active === 'login' ? "active" : "no-active"}`}>
                <a href="/login">Вход</a>
            </p>
        </div>
    )
}

export default AuthSwitch
