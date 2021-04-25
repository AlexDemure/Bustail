import sendRequest from '../../../utils/fetch'

export let aboutMe = async() => {
    let me;

    await sendRequest('/api/v1/accounts/me/', "GET")
    .then(
        (result) => {
            me = {
                email: result.email,
                city: result.city,
                phone: result.phone,
                fullname: result.fullname,
                id: result.id
            }
            return me
        },
        (error) => {
            console.log(error.message);
            me = null
        }
    )

    return me
}
