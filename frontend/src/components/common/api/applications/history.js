import {sendRequestResponseJSON} from '../../../../utils/fetch'


export let getApplicationsHistory = async() => {
    let response = await sendRequestResponseJSON('/api/v1/applications/history/', "GET")    
    return response
}
