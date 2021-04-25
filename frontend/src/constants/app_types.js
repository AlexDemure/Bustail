import sendRequest from '../utils/fetch'

export const appTypes = async() => {
    let types;
    await sendRequest('/api/v1/applications/types/', "GET")
    .then(
        (result) => {
            types = result
        }
    )
    return types
}