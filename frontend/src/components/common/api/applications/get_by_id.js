import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getApplicationCard = async(application_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/applications/${application_id}/`, "GET")    
    return response
}
