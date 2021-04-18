export const inputParsers = {
    lowercase(input) {
      return input.toLocaleLowerCase();
    },
};

export let selectErrorInputs = (message, setBorder = true) =>  {
  let inputs = message.split(",")

  for (var key in inputs) {
      
      let elements = document.getElementsByName(inputs[key])
      
      if (elements.length > 0) {
          let element = elements[0]

          if (setBorder) {
              element.style.border = "1px solid #9B5E5D"
          } else {
            element.style.border = ""
          }
          
      }
  }
}

