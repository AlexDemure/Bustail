import './css/notify.css'

import RedirectBtn from '../common/buttons/redirect_btn'

const NotifyTexts = {
    recovery: (
        `
        Вам на почту отправлено письмо с ссылкой на восстановление пароля.
        Перейдите по ссылке и установите новый пароль.
        `
    ),
    create_app: (
        `
        Спасибо что используете наш сервис.
        Ваша заявка успешно создана,
        ожидайте предложения от водителей в Личном кабинете или в Уведомлениях.
        `
    ),
    create_transport: (
        `
        Спасибо что используете наш сервис.
        Вы разместили карточку автомобиля в системе,
        ожидайте предложений от клиентов в Личном кабинете или в Уведомлениях.
        `
    ),
    changed_password: (
        `
        Пароль успешно изменен.
        Перейдите на страницу входа и авторизируйтесь.
        `
    )
}

function Notify(props) {
    return (
        <div className="notify">
            <p id="alert">Уведомление</p>
            <p id="information">{NotifyTexts[props.type]}</p>
            <RedirectBtn link={props.link} text={props.text}/>
            
        </div>
    )
}   

export default Notify
