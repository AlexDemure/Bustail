import {deleteBase} from '../base/delete'

export let deleteTransport = async(transport_id) => {
    let url = `api/v1/drivers/transports/${transport_id}/`
    let response = await deleteBase(url);
    
    return response
}
