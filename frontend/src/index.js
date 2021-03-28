import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import RegistrationPage from './pages/registration/main'
import AuthMainPage from './pages/auth/main'

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

class Main extends React.Component{
  render(){
      return <h2>Главная</h2>;
  }
}

ReactDOM.render(
  <Router>
      <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/registration" component={RegistrationPage} />
          <Route path="/login" component={AuthMainPage} />

      </Switch>
  </Router>,
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