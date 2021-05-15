import './css/switch_cabinet.css'


function CabinetSwitch(props) {
    return (
        <div className="switch__cabinet">
            <p className={`switch__cabinet__item ${props.is_active === 'common' ? "active" : "no-active"}`} id="common" onClick={props.onClick}>Общее</p>
            <p className={`switch__cabinet__item ${props.is_active === 'client' ? "active" : "no-active"}`} id="client" onClick={props.onClick}>Клиент</p>
            <p className={`switch__cabinet__item ${props.is_active === 'driver' ? "active" : "no-active"}`} id="driver" onClick={props.onClick}>Водитель</p>
            <p className={`switch__cabinet__item ${props.is_active === 'company' ? "active" : "no-active"}`} id="company" onClick={props.onClick}>Компания</p>
        </div>
    )
}

export default CabinetSwitch
