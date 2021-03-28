import './css/base.css'

function DefaultInput(props) {
    return (
        <input 
        className={"default_input " + props.input_type}
        name={props.name}
        type={props.input_type} 
        size={props.size}
        placeholder={props.placeholder}
        data-parse={props.parser}
        ></input>
    )
}

export default DefaultInput
