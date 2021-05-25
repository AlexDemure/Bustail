import {updateBase} from '../base/update'

export let updateAccount = async(data) => {
    let url = "/api/v1/accounts/"
    let response = await updateBase(url, data);
    
    return response
}
