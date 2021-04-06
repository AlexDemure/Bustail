import './css/notification.css'

function NotificationSwitch(props) {
    return (
        <div className="notification_switches">
            <div className={props.is_active === 'transport' ? "active" : "no_active"} id="transport" onClick={props.onClick}>
                <p>Транспорт</p>
                { props.count_transports > 0 && (
                    <div className="circle">
                        <p>{props.count_transports}</p>
                    </div>
                    )
                }
               
            </div>
            <div className={props.is_active === 'app' ? "active" : "no_active"} id="app" onClick={props.onClick}>
                <p>Заявки</p>
                { props.count_apps > 0 && (
                    <div className="circle">
                         <p>{props.count_apps}</p>
                    </div>
                    )
                }
            </div>
            
        </div>
    )
}

export default NotificationSwitch
