import './css/base.css'

function DefaultInput(props) {
    return (
        <input
        required={props.isRequired === false ? false : true} 
        className={"input__common " + props.input_type}
        name={props.name}
        type={props.input_type} 
        size={props.size}
        minlength={props.input_type === "password" ? 6 : 1}
        maxlength={255}
        placeholder={props.placeholder}
        data-parse={props.parser}
        ></input>
    )
}

export default DefaultInput
