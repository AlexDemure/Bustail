import './css/base.css'
import './css/offer.css'

import TransportOwnerSwitch from '../../switches/transport_owner'

export default function OfferModal(props) {
    return (
        <div className={`offer-modal ${props.offer_type}-offer modal-window__bg`}>
            <div className="modal-window__content">
                <div>
                    <p className="modal-window__title">{props.title}</p>
                    <div className="modal-window__close-btn" onClick={props.closeOffer}></div>
                </div>
                <div>
                    <p className="modal-window__text">Выберите элемент из списка</p>
                    <a href={props.create_link} className="modal-window__create-object">Создать</a>
                </div>

                {
                    props.offer_type === "transport" &&
                    <TransportOwnerSwitch
                    is_active={props.activeChoiceType}
                    onClick={props.changeChoicesType}
                    />
                }
                <div className="modal-window__choices">
                    {
                        props.choices.length > 0 ?
                        props.choices :
                        <p className="modal-window__no-choices-text">Список предложений пуст</p>
                    }
                </div>
            </div>
        </div>
    )
}
