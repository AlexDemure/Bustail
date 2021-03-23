import "./css/ticket.css"


function TicketItem(props) {
    return (
        <div class="ticket">
            <div class="ticket_design"></div>
            <div class="circle" id="left"></div>
            <div class="circle" id="right"></div>
            <div class="ticket_content">
                <div class="points">
                    <div class="from">
                        <p class="city">{props.ticket.from}</p>
                        <p class="annotation">откуда</p>
                    </div>
                    <div class="to">
                        <p class="city">{props.ticket.to}</p>
                        <p class="annotation">куда</p>
                    </div>
                </div>
                <div class="date">
                    <p>{props.ticket.date}</p>
                </div>
                <div class="info">
                    <div class="type_app">
                        <p><span>{props.ticket.type_app}</span></p>
                    </div>
                    <div class="seats">
                        <p>Пассажиров: <span>{props.ticket.seats}</span></p>
                    </div>
                    <div class="price">
                        <p>Стоимость: <span>{props.ticket.price}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default TicketItem
