import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let createBase = async(url, data) => {
    let response = await sendRequestResponseJSON(url, "POST", data)
    return response
}
