import './css/base.css'


function CabinetSwitch(props) {
    return (
        <div className="switch__cabinet">
            <p className={"switch__cabinet__item " + props.is_active === 'common' ? "active" : "no-active"} id="common" onClick={props.onClick}>Общее</p>
            <p className={"switch__cabinet__item " + props.is_active === 'driver' ? "active" : "no-active"} id="driver" onClick={props.onClick}>Водитель</p>
        </div>
    )
}

export default CabinetSwitch
