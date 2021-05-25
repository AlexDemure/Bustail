import {updateBase} from '../base/update'

export let updateCompany = async(data) => {
    let url = `/api/v1/company/`
    let response = await updateBase(url, data);
    
    return response
}
