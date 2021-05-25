import { refreshToken } from './login'
import { ValidationError } from '../constants/errors'


async function fetcher(url, method, data, token = localStorage.getItem("token")) {
    let response = await fetch(url, {
        method: method,
        headers: {
            'Content-type': 'application/json;charset=utf-8',
            'Authorization': "Bearer " + token
        },
        body: JSON.stringify(data)
    });

    return response
}

export async function sendRequest(url, method, data) {
    const bad_responses = [400, 403, 404]
    const validation_code = [422]
    const bad_token = [401]
    
    let response;
    response = await fetcher(url, method, data)

    if (response.ok) {
        return await response.json()

    } else {
        
        if (bad_token.includes(response.status)) {
            
            let token = await refreshToken()
            
            response = await fetcher(url, method, data, token)
            if (response.ok) {
                return await response.json()
            }
            
        }

        else if (validation_code.includes(response.status)) {
            let error = await response.json()
            console.log(error)
            
            let inputs_error = error.detail.map((e) => {return e.loc[1]})
            throw new ValidationError(inputs_error.toString())

        } else if (bad_responses.includes(response.status)) {
            let error = await response.json()
            console.log(error)
            throw new Error(error.detail)
 
        } else {
            throw new Error(response.statusText)
        }
        
    }
}

export async function sendRequestResponseJSON(url, method, data) {
    let response;
    
    await sendRequest(url, method, data)
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



