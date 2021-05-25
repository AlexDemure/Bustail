import {sendRequestResponseJSON} from '../../../../utils/fetch'


export let confirmAccount = async(code) => {
    let response = await sendRequestResponseJSON('/api/v1/accounts/confirm?code=' + code, "GET")
    return response
}
