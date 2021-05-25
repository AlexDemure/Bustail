import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getPaymentLink = async(payment_card) => {
    let response = await sendRequestResponseJSON(`/api/v1/payments?payment_card=${payment_card}`, "GET")
    return response
}
