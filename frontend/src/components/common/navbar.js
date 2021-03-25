import './css/navbar.css'

function NavBar(props) {
    return (
        <div class="navbar">
            <a href="/home" className="nav_btn" id="home"></a>
            <a href="/search" className="nav_btn" id="search"></a>
            <a href="/notifications" className="nav_btn" id="notifications"></a>
            <a href="/cabinet" className="nav_btn" id="cabinet"></a>
        </div> 
    )
}


export default NavBar
