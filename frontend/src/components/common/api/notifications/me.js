import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getMeNotifications = async() => {
    let response = await sendRequestResponseJSON(`/api/v1/notifications/`, "GET")
    return response
}
