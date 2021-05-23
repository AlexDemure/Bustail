import sendRequest from '../../../utils/fetch'

export let getApplicationCard = async(application_id) => {
    let application;

    await sendRequest(`/api/v1/applications/${application_id}/`, "GET")
    .then(
        (result) => {
            application = {...result}
            return application
        },
        (error) => {
            console.log(error.message);
            application = null
        }
    )

    return application
}
