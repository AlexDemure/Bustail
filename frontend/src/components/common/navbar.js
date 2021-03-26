import './css/navbar.css'

function NavBar(props) {
    return (
        <div class="navbar">
            <a href="/home" className="nav_btn" id="home">Home</a>
            <a href="/search" className="nav_btn" id="search">Search</a>
            <a href="/notifications" className="nav_btn" id="notifications">Notifications</a>
            <a href="/cabinet" className="nav_btn" id="cabinet">Cabinet</a>
        </div> 
    )
}


export default NavBar
