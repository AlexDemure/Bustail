import sendRequest from '../../../utils/fetch'

export let getMeCompanyCard = async() => {
    let company;

    await sendRequest('/api/v1/company/me/', "GET")
    .then(
        (result) => {
            company = {
                id: result.id,
                account_id: result.account_id,

                license_number: result.license_number,
                inn: result.inn,
                ogrn: result.ogrn,
                company_name: result.company_name,
                socials: result.socials,
                page_url: result.page_url,

                transports: result.transports,
                
                total_amount: result.total_amount,
                commission: result.commission,
                debt: result.debt,
                limit: result.limit
            }
            return company
            
        },
        (error) => {
            console.log(error.message);
            company = null
        }
    )

    return company
}

export let getCompanyCardByUrl = async(page_url) => {
    let company;

    await sendRequest(`/api/v1/company/pages/${page_url}/`, "GET")
    .then(
        (result) => {
            company = {
                id: result.id,
                account_id: result.account_id,
                company_phone: result.company_phone,
                license_number: result.license_number,
                inn: result.inn,
                ogrn: result.ogrn,
                company_name: result.company_name,
                socials: result.socials,
                page_url: result.page_url,

                transports: result.transports,
                
                total_amount: result.total_amount,
                commission: result.commission,
                debt: result.debt,
                limit: result.limit
            }
            return company
            
        },
        (error) => {
            console.log(error.message);
            company = null
        }
    )

    return company
}

export let getCompanyCard = async(company_id) => {
    let company;

    await sendRequest(`/api/v1/company/${company_id}/`, "GET")
    .then(
        (result) => {
            company = {
                id: result.id,
                account_id: result.account_id,

                license_number: result.license_number,
                inn: result.inn,
                ogrn: result.ogrn,
                company_name: result.company_name,
                socials: result.socials,
                page_url: result.page_url,

                transports: result.transports,
                
                total_amount: result.total_amount,
                commission: result.commission,
                debt: result.debt,
                limit: result.limit
            }
            return company
            
        },
        (error) => {
            console.log(error.message);
            company = null
        }
    )

    return company
}