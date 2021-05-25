import {createBase} from '../base/create'

export let createTransport = async(data) => {
    let url = '/api/v1/drivers/transports/'
    let response = await createBase(url, data);
    
    return response
}
