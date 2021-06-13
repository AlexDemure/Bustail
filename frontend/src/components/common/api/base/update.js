import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let updateBase = async(url, data = null) => {
    let response = await sendRequestResponseJSON(url, "PUT", data)
    return response
}
