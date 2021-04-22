import './css/payment_data.css'

function PaymentData(props) {
    return (
        <div className="cabinet__driver__payment-data">
            <div className="cabinet__driver__payment-data__card-design">
                <p className="cabinet__driver__payment-data__item__text">Bustail</p>
            </div>
            <div className="cabinet__driver__payment-data__total-amount">
                <p className="cabinet__driver__payment-data__item__number">{props.total}</p>
                <p className="cabinet__driver__payment-data__item__text">Заработано</p>
            </div>
            <div className="cabinet__driver__payment-data__pay-btn">
                <p>Оплатить</p>
            </div>
            <div className="cabinet__driver__payment-data__debt-amount">
                <p className="cabinet__driver__payment-data__item__number">{props.debt}</p>
                <p className="cabinet__driver__payment-data__item__text">Долг</p>
            </div>
            <div className="cabinet__driver__payment-data__commission-amount">
                <p className="cabinet__driver__payment-data__item__number">{props.commission}</p>
                <p className="cabinet__driver__payment-data__item__text">Коммиссия</p>
            </div>
            <div className="cabinet__driver__payment-data__limit-amount">
                <p className="cabinet__driver__payment-data__item__number">{props.limit}</p>
                <p  className="cabinet__driver__payment-data__item__text">Лимит</p>
            </div>
        </div>
    )
}

export default PaymentData
