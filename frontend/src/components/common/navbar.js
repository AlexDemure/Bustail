import './css/navbar.css'

function NavBar(props) {
    return (
        <div className="navbar__common">
            <a href="/main" className="navbar__common__btn" id="home">Home</a>
            <a href="/history" className="navbar__common__btn" id="history">History</a>
            <a href="/notifications" className="navbar__common__btn" id="notifications">Notifications</a>
            <a href="/cabinet" className="navbar__common__btn" id="cabinet">Cabinet</a>
        </div> 
    )
}


export default NavBar
