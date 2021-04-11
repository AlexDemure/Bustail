import './css/base.css'

function SubmitButton(props) {
    return (
        <input
        type="submit"
        value={props.value ? props.value : "Отправить"}
        className={"input__common__submit " + (props.className ? props.className : "")}
        ></input>
    )
}

export default SubmitButton
