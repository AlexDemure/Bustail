
export async function refreshToken() {
    const response = await fetch("/api/v1/login/refresh-token/", {
        method: "POST",
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify({token: localStorage.getItem("refresh")})
    });

    if (response.ok) {
        let result = await response.json()

        localStorage.setItem('token', result.access_token)
        localStorage.setItem('refresh', result.refresh_token)
        return result.access_token
        
    } else {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')

        window.location.replace("/login")
    }
}


export async function getAuthToken(username, password) {
    const bad_responses = [401, 403, 404]

    let data = new URLSearchParams(
        {
            username: username,
            password: password
        }
    )

    const response = await fetch('/api/v1/login/access-token/', {
        method: "POST",
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: data
    });

    if (response.ok) {
        let result = await response.json()

        localStorage.setItem('token', result.access_token)
        localStorage.setItem('is_confirmed', true)
        localStorage.setItem('refresh', result.refresh_token)

    } else {
        if (bad_responses.includes(response.status)) {
            let error = await response.json()
            throw new Error(error.detail) 

        } else {
            throw new Error(response.statusText)
        }
        
    }
    
}