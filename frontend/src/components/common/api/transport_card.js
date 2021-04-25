import sendRequest from '../../../utils/fetch'

export let getTransportCard = async(transport_id) => {
    let transport;

    await sendRequest(`/api/v1/drivers/transports/${transport_id}/`, "GET")
    .then(
        (result) => {
            transport = {...result}
            return transport
        },
        (error) => {
            console.log(error.message);
            transport = null
        }
    )

    return transport
}
