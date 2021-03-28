import inputParsers from '../constants/input_parsers'

export default function SerializeForm(form, data) {
    // Сериализация данных из Form
    // Примнимает form - event.target и data - FormData(event.target)

    for (let name of data.keys()) {
        const input = form.elements[name];
        const parserName = input.dataset.parse;
    
        if (parserName) {
          const parser = inputParsers[parserName];
          const parsedValue = parser(data.get(name));
          data.set(name, parsedValue);
        }    
      }
    
    return data;
}


