export default function isAuth(redirect = true) {
    let token = localStorage.getItem("token")
    let is_confirmed = localStorage.getItem("is_confirmed")

    if (token !== null && is_confirmed === "true") {
        return true
    } else {
        if (!redirect) {
            return false
        }
       
        if (window.location.pathname === '/login') {
            return false
        } else {
            window.location.replace("/login")
        }
    }
   
}
