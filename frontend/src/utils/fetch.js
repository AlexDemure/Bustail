
async function sendRequest(url, method, data, token = localStorage.getItem("token")) {
    const bad_responses = [400, 401, 403, 404]
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
        if (bad_responses.includes(response.status)) {
            let error = await response.json()
            throw new Error(error.detail) 
        } else {
            throw new Error(response.statusText)
        }
        
    }
}

export default sendRequest
