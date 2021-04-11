import './css/base.css'

function TextAreaInput(props) {
    return (
        <textarea 
        className={"textarea__common"}
        name={props.name}
        rows={props.size}
        placeholder={props.placeholder}
        ></textarea>
    )
}

export default TextAreaInput
