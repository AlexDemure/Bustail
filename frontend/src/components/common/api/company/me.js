import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getMeCompanyCard = async() => {
    let response = await sendRequestResponseJSON('/api/v1/company/me/', "GET")
    return response
}
