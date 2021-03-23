import './css/transport.css'

function TransportItem(props) {
    return (
        <div class="transport">
            <div class="photo"></div>
            <div class="info">
                <p id="model">{props.transport.mark} {props.transport.model}</p>
                <p class="parametr">вместимость: <span>{props.transport.seats}</span></p>
                <p class="parametr">стоимость: <span>{props.transport.price}</span></p>
                <p class="parametr">город: <span>{props.transport.city}</span></p>
            </div>
            <div class="controls">
                <div class="control_icon" id="contacts"></div>
                <div class="control_icon" id="info"></div>
                <div class="control_icon" id="offer"></div>
            </div>
        </div>
    )
}


export default TransportItem
