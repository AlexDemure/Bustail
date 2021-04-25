import sendRequest from '../../../utils/fetch'

export let getDriverCard = async() => {
    let driver;

    await sendRequest('/api/v1/drivers/me/', "GET")
    .then(
        (result) => {
            driver = {
                license_number: result.license_number,
                inn: result.inn,
                company_name: result.company_name,
                account_id: result.account_id,
                transports: result.transports,
                id: result.id,
                total_amount: result.total_amount,
                commission: result.commission,
                debt: result.debt,
                limit: result.limit
            }
            return driver
            
        },
        (error) => {
            console.log(error.message);
            driver = null
        }
    )

    return driver
}