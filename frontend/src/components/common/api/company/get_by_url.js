import {sendRequestResponseJSON} from '../../../../utils/fetch'

export let getCompanyCardByUrl = async(page_url) => {
    let response = await sendRequestResponseJSON(`/api/v1/company/pages/${page_url}/`, "GET")
    return response
}
