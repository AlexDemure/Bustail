export default function isAuth(redirect = false) {
    let token = localStorage.getItem("token")
    let is_confirmed = localStorage.get("is_confirmed")

    if (token === null || (is_confirmed === false || is_confirmed === null) ) {
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
