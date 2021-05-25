import {updateBase} from '../base/update'

export let changePassword = async(token, data) => {
    let url = '/api/v1/accounts/change_password?security_token=' + token
    let response = await updateBase(url, data);
    
    return response
}
