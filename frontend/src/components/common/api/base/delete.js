import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let deleteBase = async(url) => {
    let response = await sendRequestResponseJSON(url, "DELETE")
    return response
}
