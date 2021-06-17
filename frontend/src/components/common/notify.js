import './css/notify.css'

import RedirectButton from '../common/buttons/redirect_btn'

const NotifyTexts = {
    recovery: (
        `
        Вам на почту отправлено письмо с ссылкой на восстановление пароля.
        Перейдите по ссылке и установите новый пароль.
        `
    ),
    create_app: (
        `
        Ваша заявка успешно добавлена в систему.
        Ожидайте предложения от водителей во вкладке "Уведомления" или самостоятельно предлагайте вашу заявку водителям.
        `
    ),
    create_transport: (
        `
        Ваш транспорт успешно добавлен в систему.
        Ожидайте предложения от клиентов во вкладке "Уведомления" или самостоятельно предлагайте ваш транспорт клиентам.
        `
    ),
    changed_password: (
        `
        Пароль успешно изменен.
        Перейдите на страницу входа и авторизируйтесь.
        `
    ),
    create_carrier: (
        `
        Для этого действия необходима карточка перевозчика.
        Чтобы создать карточку перевозчика,
        перейдите в "Личный кабинет" и выберите "Перевозчик"
        `
    ),
}

function Notify(props) {
    return (
        <div className="notify__common">
            <p className="notify__common__title">Уведомление</p>
            <p className="notify__common__text">{NotifyTexts[props.type]}</p>
            <RedirectButton link={props.link} text={props.text}/>
        </div>
    )
}   

export default Notify
