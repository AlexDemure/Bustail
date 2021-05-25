import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getAccountCard = async(account_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/accounts/${account_id}/`, "GET")
    return response
}
