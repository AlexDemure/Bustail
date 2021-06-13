import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getTransports = async(city = null, transport_type = null, offset = 0, order_by = "updated_at", order_type="desc") => {
        
    let url = `/api/v1/drivers/transports/?limit=10&offset=${offset}&order_by=${order_by}&order_type=${order_type}&`
    
    if (transport_type !== null && transport_type !== "") {
        url += transport_type
    }

    if (city !== null && city !== "") {
        url += `city=${city}`
    }
    
    let response = await sendRequestResponseJSON(url, "GET")
    return response
}
