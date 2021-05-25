import {createBase} from '../base/create'

export let createNotification = async(data) => {
    let url = "/api/v1/notifications/"
    let response = await createBase(url, data);

    return response
}
