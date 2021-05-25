import {sendRequestResponseJSON} from '../../../../utils/fetch'

export const appTypes = async() => {
    let response = await sendRequestResponseJSON('/api/v1/applications/types/', "GET")
    return response
}