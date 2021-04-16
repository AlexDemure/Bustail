
async function sendRequest(url, method, data, token = "") {
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json()
    } else {
        if ([400, 404].includes(response.status)) {
            let error = await response.json()
            throw new Error(error.detail) 
        } else {
            throw new Error(response.statusText)
        }
        
    }
}

export default sendRequest
