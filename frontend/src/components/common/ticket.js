import "./css/ticket.css"


function TicketItem(props) {
    return (
        <div className="ticket">
            <div className="ticket_design"></div>
            <div className="circle" id="left"></div>
            <div className="circle" id="right"></div>
            <div className="ticket_content">
                <div className="points">
                    <div className="from">
                        <p className="city">{props.ticket.from}</p>
                        <p className="annotation">откуда</p>
                    </div>
                    <div className="to">
                        <p className="city">{props.ticket.to}</p>
                        <p className="annotation">куда</p>
                    </div>
                </div>
                <div className="date">
                    <p>{props.ticket.date}</p>
                </div>
                <div className="info">
                    <div className="type_app">
                        <p><span>{props.ticket.type_app}</span></p>
                    </div>
                    <div className="seats">
                        <p>Пассажиров: <span>{props.ticket.seats}</span></p>
                    </div>
                    <div className="price">
                        <p>Стоимость: <span>{props.ticket.price}</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default TicketItem
