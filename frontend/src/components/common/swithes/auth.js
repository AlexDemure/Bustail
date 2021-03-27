import './css/auth.css'


function AuthSwitch(props) {
    return (
        <div className="auth_switches">
            <p className={props.is_active === 'reg' ? "active" : "no_active"} id="reg"><a href="/registration">Регистрация</a></p>
            <p className="no_active" id="vertical_line">|</p>
            <p className={props.is_active === 'login' ? "active" : "no_active"} id="login"><a href="/login">Вход</a></p>
        </div>
    )
}

export default AuthSwitch
