import {sendRequestResponseJSON} from '../../../../utils/fetch'


export let getCompanyCard = async(company_id) => {
    let response = await sendRequestResponseJSON(`/api/v1/company/${company_id}/`, "GET")
    return response
}