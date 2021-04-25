import sendRequest from '../../../utils/fetch'

export let getMeApps = async() => {
    let me_apps = [];
    await sendRequest('/api/v1/applications/client/', "GET")
    .then(
        (result) => {
            me_apps = result.applications
        },
        (error) => {
            console.log(error)
        }
    )
    return me_apps
}
