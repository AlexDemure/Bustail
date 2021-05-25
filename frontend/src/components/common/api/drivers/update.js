import {updateBase} from '../base/update'

export let updateDriver = async(data) => {
    let url = `/api/v1/drivers/`
    let response = await updateBase(url, data);
    
    return response
}
