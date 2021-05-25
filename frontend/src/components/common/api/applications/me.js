import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getMeApps = async() => {
    let response = await sendRequestResponseJSON('/api/v1/applications/client/', "GET")
    return response
}
