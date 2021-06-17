import './css/cabinet.css'
import './css/base.css'
import './css/inline.css'

function CabinetSwitch(props) {
    return (
        <div className="switch inline cabinet">
            <p className={`switch__item ${props.is_active === 'common' ? "active" : "no-active"}`} id="common" onClick={props.onClick}>Общее</p>
            <p className={`switch__item ${props.is_active === 'client' ? "active" : "no-active"}`} id="client" onClick={props.onClick}>Клиент</p>
            <p className={`switch__item ${props.is_active === 'carrier' ? "active" : "no-active"}`} id="carrier" onClick={props.onClick}>Перевозчик</p>
        </div>
    )
}

export default CabinetSwitch
