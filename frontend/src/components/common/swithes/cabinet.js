import './css/cabinet.css'


function CabinetSwitch(props) {
    return (
        <div className="cabinet_switches">
            <p className={props.is_active === 'common' ? "active" : "no_active"} id="common" onClick={props.onClick}>Общее</p>
            <p className={props.is_active === 'driver' ? "active" : "no_active"} id="driver" onClick={props.onClick}>Водитель</p>
        </div>
    )
}

export default CabinetSwitch
