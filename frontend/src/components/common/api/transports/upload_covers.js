import { uploadFile } from '../../../../utils/upload_file'


export let uploadCovers = async(transport_id, data) => {
    let response;

    let url = `/api/v1/drivers/transports/${transport_id}/covers/`
    
    await uploadFile(url, data)
    .then(
        (result) => {
            response = {
                result: result,
                error: null,
            }
        },
        (error) => {
            response = {
                result: null,
                error: error,
            }
        }
    )
    return response
}