import './css/switch_card.css'


function CardSwitch(props) {
    return (
        <div className="switch__card">
            <p className={`switch__card__item ${props.is_active === 'form' ? "active" : "no-active"}`} id="form" onClick={props.onClick}>Данные</p>
            <p 
            className={
                `switch__card__item ${props.is_active === 'card' ? "active" : "no-active"} ${props.isDisable ? "disable" : ""}`
            }
            id="card"
            onClick={props.onClick}>Карточка</p>
        </div>
    )
}

export default CardSwitch
