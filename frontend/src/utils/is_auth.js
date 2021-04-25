export default function isAuth(redirect = false) {
    let token = localStorage.getItem("token")
    if (token === null) {
        if (!redirect) {
            return false
        }
        
        if (window.location.pathname === '/login') {
            return false
        } else {
            window.location.replace("/login")
        }
    }

    return true
}
