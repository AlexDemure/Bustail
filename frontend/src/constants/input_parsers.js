export const inputParsers = {
    lowercase(input) {
      return input.toLocaleLowerCase();
    },
};

export let selectErrorInputs = (message, setBorder = true) =>  {
  let errors = message.split(",")
  let inputs = Array.prototype.slice.call(document.getElementsByTagName("input"))

  for (let input in inputs) {
    if (errors.includes(inputs[input].name)) {
        if (setBorder) {
          inputs[input].style.border = "1px solid #9B5E5D"
        } else {
          inputs[input].style.border = ""
        }
    } else {
        inputs[input].style.border = ""
    }
  }

}

