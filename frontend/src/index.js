import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/common/header'
import NavBar from './components/common/navbar'
import SearchInput from './components/common/inputs'
import TransportItem from './components/common/transport'

import './index.css'

// const ticket = {
//   "from": "Челябинск", "to": "Москва", "date": "16.10.21",
//   "price": 16000, "type_app": "Свадьба", "seats": 24,
// }

const transport = {
  "mark": "Mersedes Benz", "model": "Splinter",
  "price": 900, "seats": 24, "city": "Челябинск",
  "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  "photo": "base64", "phone": "+79123456789",
  "driver": "Иванов Иван", "driver_license": "312-1251-1231"
}

ReactDOM.render(
  <React.StrictMode>
    <Header previous_page="test" page_name="Главная" />
    <SearchInput />
    <TransportItem transport={transport} />
    
    <NavBar/>
  </React.StrictMode>,
  document.getElementById('root')
);

// #181818 ФОН
// #222222 ДИВ + БАТТОНС
// #262626 Уведомления
// #FBFBFB Белый текст
// #535353 Серый текст
// #50816C Зеленый текст
// #9B5E5D Красный текст
// #656565 Иконки
// #80AB98 Иконки активные
// #0B0B0B Инпуты