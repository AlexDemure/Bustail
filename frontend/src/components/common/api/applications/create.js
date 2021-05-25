import {createBase} from '../base/create'

export let createApplication = async(data) => {
    let url = '/api/v1/applications/'
    let response = await createBase(url, data);
    
    return response
}
