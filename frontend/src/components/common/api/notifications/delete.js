import {deleteBase} from '../base/delete'

export let deleteNotification = async(notification_id) => {
    let url = `/api/v1/notifications/${notification_id}/`
    let response = await deleteBase(url);
    
    return response
}
