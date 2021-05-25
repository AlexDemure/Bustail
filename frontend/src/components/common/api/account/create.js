import {createBase} from '../base/create'


export let createAccount = async(data) => {
    let response = await createBase('/api/v1/accounts/', data)
    return response
}
