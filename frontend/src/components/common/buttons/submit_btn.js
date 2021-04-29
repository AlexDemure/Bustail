import './css/base.css'

function SubmitButton(props) {
    return (
        <button
        type="submit"
        className={"input__common__submit " + (props.className ? props.className : "")}
        value={props.value ? props.value : "Отправить"}
        />
    )
}

export default SubmitButton
