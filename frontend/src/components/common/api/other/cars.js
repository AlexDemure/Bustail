import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getCars = async() => {
    let response = await sendRequestResponseJSON('/api/v1/cars/', "GET")
    return response
}