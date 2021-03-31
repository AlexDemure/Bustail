import './css/base.css'

function TextAreaInput(props) {
    return (
        <textarea 
        className={"default_textarea"}
        name={props.name}
        rows={props.size}
        placeholder={props.placeholder}
        ></textarea>
    )
}

export default TextAreaInput
