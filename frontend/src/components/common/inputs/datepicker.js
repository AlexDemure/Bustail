import { useState } from 'react'

import DatePicker from "react-datepicker";

import './css/datepicker.css'
import "react-datepicker/dist/react-datepicker.css"

const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабр']
const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const locale = {
  localize: {
    month: n => months[n],
    day: n => days[n]
  },
  formatLong: {}
}

export default function InputDate(props) {
    const [startDate, setStartDate] = useState(new Date());

    return (
        <DatePicker
          placeholderText="Дата поездки (дд.мм.гггг)"
          dateFormat="dd.MM.yyyy"
          selected={startDate}
          onChange={date => setStartDate(date)}
          className="input__common date"
          name={props.name}
          locale={locale}
          minDate={new Date()}
        />
      );
}