import {updateBase} from '../base/update'

export let updateTransport = async(transport_id, data) => {
    let url =`/api/v1/drivers/transports/${transport_id}/`
    let response = await updateBase(url, data);
    
    return response
}
