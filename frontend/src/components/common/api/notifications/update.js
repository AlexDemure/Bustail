import {updateBase} from '../base/update'

export let updateNotification = async(data) => {
    let url = `/api/v1/notifications/`
    let response = await updateBase(url, data);
    
    return response
}
