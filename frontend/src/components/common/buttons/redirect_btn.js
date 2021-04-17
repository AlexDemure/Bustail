import './css/base.css'


function RedirectButton(props) {
    return (
        <div onClick={props.onClick} className="button__common__redirect">
            <a href={props.link}>{props.text}</a>
        </div>
    )
}

export default RedirectButton
