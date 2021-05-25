import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let sendChangePasswordCode = async(data) => {
    let response = await sendRequestResponseJSON('/api/v1/mailing/change_password/', "POST", data)
    return response
}
