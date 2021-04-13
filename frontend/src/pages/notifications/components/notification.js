import './css/notification.css'

function NotificationSwitch(props) {
    return (
        <div className="switch__notification">
            <div className={`switch__notification__item ${props.is_active === 'transport' ? "active" : "no-active"}`} onClick={props.onClick}>
                <p>Транспорт</p>
                { props.count_transports > 0 && (
                    <div className="switch__notification__circle">
                        <p>{props.count_transports}</p>
                    </div>
                    )
                }
               
            </div>
            <div className={`switch__notification__item ${props.is_active === 'app' ? "active" : "no-active"}`} onClick={props.onClick}>
                <p>Заявки</p>
                { props.count_apps > 0 && (
                    <div className="switch__notification__circle">
                         <p>{props.count_apps}</p>
                    </div>
                    )
                }
            </div>
            
        </div>
    )
}

export default NotificationSwitch
