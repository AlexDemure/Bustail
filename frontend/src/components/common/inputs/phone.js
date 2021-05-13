

export default function InputPhone(props) {

    var setDefaultPrefix = (e) => {
        if (e.target.value === '') {
            e.target.value = "+7"
        }
    }

    return (
        <input
        required={props.isRequired === false ? false : true} 
        className="input__common phone"
        name="phone"
        type="text"
        size={props.size}
        minLength={12}
        maxLength={12}
        placeholder="Телефон"
        data-parse={props.parser}
        defaultValue={props.value}
        readOnly={props.readOnly || false}
        onClick={setDefaultPrefix}
        onFocus={setDefaultPrefix}
        ></input>
    )
}
