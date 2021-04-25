import sendRequest from '../utils/fetch'

export const getCities = async() => {
    let cities;
    await sendRequest('/api/v1/cities/', "GET")
    .then(
        (result) => {
            cities = result
        }
    )
    return cities
}