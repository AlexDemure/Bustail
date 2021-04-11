import './css/base.css'

function DefaultInput(props) {
    return (
        <input 
        className={"input__common " + props.input_type}
        name={props.name}
        type={props.input_type} 
        size={props.size}
        placeholder={props.placeholder}
        data-parse={props.parser}
        ></input>
    )
}

export default DefaultInput
