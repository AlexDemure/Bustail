import sendRequest from '../../../utils/fetch'

export let getMeNotifications = async() => {
    let data;

    await sendRequest(`/api/v1/notifications/`, "GET")
    .then(
        (result) => {
            data = result
            return data
        },
        (error) => {
            console.log(error.message);
            data = null
        }
    )

    return data
}
