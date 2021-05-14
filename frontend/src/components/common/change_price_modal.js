import DefaultInput from './inputs/default'
import SubmitButton from './buttons/submit_btn'

import './css/change_price_modal.css'


export default function ChangePrice(props) {
    return (
        <div className="change_price__modal-window__bg">
            <div className="change_price__modal-window__content">
                <div>
                    <p className="change_price__modal-window__title">Предложения стоимости</p>
                    <div className="change_price__modal-window__close-btn" onClick={props.closeOffer}></div>
                </div>
                <div className="change_price__modal-window__text">
                    <p>
                        Вы можете изменять или устанавливать стоимость заявки для каждого предложения.
                        Пользователь увидет измененную сумму в уведомлениях.
                    </p>
                </div>
                <form className="change_price__form" onSubmit={props.onSubmit}>
                    <DefaultInput name="price" input_type="number" maxLength={7} size="7" value={props.value} isRequired={false}/>
                    <SubmitButton value="Изменить"/>
                </form>
            </div>
        </div>
       
    )
}