import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getCities = async() => {
    let response = await sendRequestResponseJSON('/api/v1/cities/', "GET")
    return response
}