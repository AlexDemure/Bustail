import sendRequest from '../utils/fetch'

export const getCars = async() => {
    let cars;
    await sendRequest('/api/v1/cars/', "GET")
    .then(
        (result) => {
            cars = result
        }
    )
    return cars
}