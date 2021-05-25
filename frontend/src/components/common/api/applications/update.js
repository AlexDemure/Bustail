import {updateBase} from '../base/update'

export let updateApplication = async(application_id, data) => {
    let url = `/api/v1/applications/${application_id}/`
    let response = await updateBase(url, data);
    
    return response
}
