import React from 'react'

import './css/payment_data.css'

export default class PaymentData extends React.Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="cabinet__payment-data">
                <div className="cabinet__payment-data__card-design">
                    <p className="cabinet__payment-data__item__text">Bustail</p>
                </div>
                <div className="cabinet__payment-data__total-amount">
                    <p className="cabinet__payment-data__item__number">{this.props.total}</p>
                    <p className="cabinet__payment-data__item__text">Заработано</p>
                </div>
                <div className="cabinet__payment-data__pay-btn" onClick={this.props.getPaymentLink}>
                    <p>Оплатить</p>
                </div>
                <div className="cabinet__payment-data__debt-amount">
                    <p className="cabinet__payment-data__item__number">{this.props.debt}</p>
                    <p className="cabinet__payment-data__item__text">Долг</p>
                </div>
                <div className="cabinet__payment-data__commission-amount">
                    <p className="cabinet__payment-data__item__number">{this.props.commission}</p>
                    <p className="cabinet__payment-data__item__text">Коммиссия</p>
                </div>
                <div className="cabinet__payment-data__limit-amount">
                    <p className="cabinet__payment-data__item__number">{this.props.limit}</p>
                    <p  className="cabinet__payment-data__item__text">Лимит</p>
                </div>
            </div>
        )
    }
    
}

