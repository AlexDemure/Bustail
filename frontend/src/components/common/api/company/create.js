import {createBase} from '../base/create'

export let createCompany = async(data) => {
    let url = '/api/v1/company/'
    let response = await createBase(url, data);
    
    return response
}
