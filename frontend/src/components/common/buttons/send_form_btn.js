import './css/send_form_btn.css'

function SendFormBtn(props) {
    return (
        <input
        type="submit"
        value={props.value ? props.value : "Отправить"}
        className={"default_btn " + (props.className ? props.className : "")}
        ></input>
    )
}

export default SendFormBtn
