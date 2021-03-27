import './css/send_form_btn.css'

function SendFormBtn(props) {
    return (
        <input type="submit" value={props.value ? props.value : "Отправить"}></input>
    )
}

export default SendFormBtn
