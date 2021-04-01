import './css/payment_data.css'

function PaymentData(props) {
    return (
        <div className="payment_data">
            <div className="card_design">
                <p id="text">Bustail</p>
            </div>
            <div className="total">
                <p id="number">{props.total}</p>
                <p id="text">Заработано</p>
            </div>
            <div className="pay">
                <p>Оплатить</p>
            </div>
            <div className="commission">
                <p id="number">{props.commission}</p>
                <p id="text">Коммиссия</p>
            </div>
            <div className="debt">
                <p id="number">{props.debt}</p>
                <p id="text">Долг</p>
            </div>
            <div className="limit">
                <p id="number">{props.limit}</p>
                <p id="text">Лимит</p>
            </div>
        </div>
    )
}

export default PaymentData
