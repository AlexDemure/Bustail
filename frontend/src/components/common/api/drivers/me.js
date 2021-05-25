import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getMeDriverCard = async() => {
    let response = await sendRequestResponseJSON('/api/v1/drivers/me/', "GET")
    return response
}