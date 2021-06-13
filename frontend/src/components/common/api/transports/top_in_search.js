import {updateBase} from '../base/update'

export let topInSearch = async(transport_id) => {
    let url =`/api/v1/drivers/transports/${transport_id}/top_in_search/`
    let response = await updateBase(url);
    
    return response
}
