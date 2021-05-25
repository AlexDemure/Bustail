import {sendRequestResponseJSON} from '../../../../utils/fetch'


export let sendVerifyCode = async(data) => {
    let response = sendRequestResponseJSON('/api/v1/mailing/verify_code/', "POST", data)
    return response
}
