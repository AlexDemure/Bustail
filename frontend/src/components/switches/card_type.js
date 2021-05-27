import './css/base.css'
import './css/buttons.css'

function CardTypeSwitch(props) {
    return (
        <div className="switch buttons card-type">
            <p className={`switch__item ${props.is_active === 'form' ? "active" : "no-active"}`} id="form" onClick={props.onClick}>Данные</p>
            <p 
            className={
                `switch__item ${props.is_active === 'card' ? "active" : "no-active"} ${props.isDisable ? "disable" : ""}`
            }
            id="card"
            onClick={props.onClick}>Карточка</p>
        </div>
    )
}

export default CardTypeSwitch
