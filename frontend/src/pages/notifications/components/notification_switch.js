import './css/notification_switch.css'

function NotificationSwitch(props) {
    return (
        <div className="switch__notification">
            <div className={`switch__notification__item ${props.is_active === 'client' ? "active" : "no-active"}`} id="client" onClick={props.onClick}>
                <p id="client">Клиент</p>
                { props.client_notifications > 0 && (
                    <div id="client" className="switch__notification__circle">
                        <p>{props.client_notifications}</p>
                    </div>
                    )
                }
               
            </div>
            <div className={`switch__notification__item ${props.is_active === 'driver' ? "active" : "no-active"}`} id="driver" onClick={props.onClick}>
                <p id="driver">Перевозчик</p>
                { props.driver_notifications > 0 && (
                    <div id="driver" className="switch__notification__circle">
                         <p>{props.driver_notifications}</p>
                    </div>
                    )
                }
            </div>
            
        </div>
    )
}

export default NotificationSwitch
