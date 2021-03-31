import './css/navbar.css'

function NavBar(props) {
    return (
        <div class="navbar">
            <a href="/main" className="nav_btn" id="home">Home</a>
            <a href="/history" className="nav_btn" id="history">History</a>
            <a href="/notifications" className="nav_btn" id="notifications">Notifications</a>
            <a href="/cabinet" className="nav_btn" id="cabinet">Cabinet</a>
        </div> 
    )
}


export default NavBar
