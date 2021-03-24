import './css/header.css'

function Header(props) {
    let divItem;
    
    if (props.previous_page) {
        divItem = <a href={props.previous_page} id="left"><div id="left"></div></a>
    } else {
        divItem = <div id="none"></div>
    }

    return (
        <header>
            {divItem}
            <div id="page_name">
                {props.page_name ? props.page_name : "Bustail"}
            </div>
            <div id="menu"></div>
        </header>
    )
}

export default Header