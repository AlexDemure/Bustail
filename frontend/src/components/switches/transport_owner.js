function TransportOwnerSwitch(props) {
    return (
        <div className="switch__card">
            <p className={`switch__card__item ${props.is_active === 'personal' ? "active" : "no-active"}`} id="personal" onClick={props.onClick}>Частное лицо</p>
            <p className={`switch__card__item ${props.is_active === 'company' ? "active" : "no-active"}`} id="company" onClick={props.onClick}>Компания</p>
        </div>
    )
}

export default TransportOwnerSwitch
