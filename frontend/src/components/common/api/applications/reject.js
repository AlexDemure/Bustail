import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let rejectApplication = async(application_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/applications/${application_id}/reject/`, "PUT")
    return response
}
