import './css/notify.css'

import RedirectBtn from '../common/buttons/redirect_btn'

const NotifyTexts = {
    recovery: (
        `
        Вам на почту отправлено письмо с ссылкой на восстановление пароля.
        Перейдите по ссылке и установите новый пароль.
        `
    )
}

function Notify(props) {
    return (
        <div className="notify">
            <p id="alert">Уведомление</p>
            <p id="information">{NotifyTexts[props.type]}</p>
            <RedirectBtn link="/login" text="Войти"/>
            
        </div>
    )
}   

export default Notify
