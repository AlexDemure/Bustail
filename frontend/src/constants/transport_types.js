import sendRequest from '../utils/fetch'

export const trasportTypes = async() => {
    let types;
    await sendRequest('/api/v1/drivers/transports/types/', "GET")
    .then(
        (result) => {
            types = result
        }
    )
    return types
}