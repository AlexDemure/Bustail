export const inputParsers = {
    lowercase(input) {
      return input.toLocaleLowerCase();
    },
    whitespace(input) {
      return input.replace(/\s/g,'')
    },
    combine(input) {
      return input.replace(/\s/g,'').toLocaleLowerCase();
    }
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

export let validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (validTypes.indexOf(file.type) === -1) {
      return false;
  }
  return true;
}