import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getTransportCard = async(transport_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/drivers/transports/${transport_id}/`, "GET")
    return response
}
