import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getDriverCard = async(driver_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/drivers/${driver_id}/`, "GET")
    return response
}