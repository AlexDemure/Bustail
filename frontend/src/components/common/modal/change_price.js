import DefaultInput from '../inputs/default'
import SubmitButton from '../buttons/submit_btn'

import './css/base.css'
import './css/change_price.css'


export default function ChangePrice(props) {
    return (
        <div className="change-price modal-window__bg">
            <div className="modal-window__content">
                <div>
                    <p className="modal-window__title">Предложения стоимости</p>
                    <div className="modal-window__close-btn" onClick={props.closeOffer}></div>
                </div>
                <div className="modal-window__text">
                    <p>
                        Вы можете изменять или устанавливать стоимость заявки для каждого предложения.
                        Пользователь увидет измененную сумму в уведомлениях.
                    </p>
                </div>
                <form className="modal-window__form" onSubmit={props.onSubmit}>
                    <DefaultInput name="price" input_type="number" maxLength={7} size="7" value={props.value} isRequired={false}/>
                    <SubmitButton value="Изменить"/>
                </form>
            </div>
        </div>
       
    )
}