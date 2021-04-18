import './css/base.css'

import React from 'react'

function DefaultInput(props) {
    let input_type;
    if (props.input_type === "date") {
        input_type = <input
        className={"input__common " + props.input_type}
        name={props.name}
        placeholder={props.placeholder}
        size={props.size}
        minLength={10}
        maxLength={10}
        >
        </input> 
    } else {
        input_type = <input
        required={props.isRequired === false ? false : true} 
        className={"input__common " + props.input_type}
        name={props.name}
        type={props.input_type} 
        size={props.size}
        minLength={props.input_type === "password" ? 6 : 1}
        maxLength={255}
        placeholder={props.placeholder}
        data-parse={props.parser}
        defaultValue={props.value}
        readOnly={props.readOnly || false}
        ></input>
    }
    return (
        <React.Fragment>
            {input_type}
        </React.Fragment>
       
    )
}

export default DefaultInput
