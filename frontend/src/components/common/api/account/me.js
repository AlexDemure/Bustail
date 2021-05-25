import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getMeAccountCard = async() => {
    let response = await sendRequestResponseJSON('/api/v1/accounts/me/', "GET")    
    return response
}
