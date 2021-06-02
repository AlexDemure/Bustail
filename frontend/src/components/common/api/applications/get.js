import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getApplications = async(city = null, application_type = null, offset = 0, order_by = "to_go_when", order_type="asc") => {
    
    let url = `/api/v1/applications/?limit=10&offset=${offset}&order_by=${order_by}&order_type=${order_type}&`
    
    if (application_type !== null && application_type !== "") {
        url += application_type
    }

    if (city !== null && city !== "") {
        url += `city=${city}`
    }

    let response = await sendRequestResponseJSON(url, "GET")
    return response
}
