import {createBase} from '../base/create'

export let createDriver = async(data) => {
    let url = '/api/v1/drivers/'
    let response = await createBase(url, data);
    
    return response
}
