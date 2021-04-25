export async function uploadFile(url, data) {
    let response = await fetch(url, {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + localStorage.getItem("token")
        },
        body: data
    });

    if (response.ok) {
        return await response.json()
    } else {
        let error = await response.json()
        console.log(error)
        throw new Error(error.detail)
    }
} 