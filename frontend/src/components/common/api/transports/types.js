import {sendRequestResponseJSON} from '../../../../utils/fetch'

export const transportTypes = async() => {
    let response = await sendRequestResponseJSON('/api/v1/drivers/transports/types/', "GET")
    return response
}