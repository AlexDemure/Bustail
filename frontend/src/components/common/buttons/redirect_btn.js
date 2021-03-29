import './css/redirect_btn.css'


function RedirectBtn(props) {
    return (
        <div id="link">
            <a href={props.link}>{props.text}</a>
        </div>
    )
}

export default RedirectBtn
