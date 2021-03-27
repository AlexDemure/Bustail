import './css/base.css'

function DefaultInput(props) {
    return (
        <input 
        className={"default_input " + props.input_type}
        type={props.input_type} 
        size={props.size}
        placeholder={props.placeholder}
        ></input>
    )
}

export default DefaultInput
