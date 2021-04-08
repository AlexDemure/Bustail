import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import RegistrationPage from './pages/registration/main'
import AuthPage from './pages/auth/main'
import RecoveryPage from './pages/recovery/main'
import ChangePasswordPage from './pages/recovery/change_password'
import MainPage from './pages/main/main'
import CabinetPage from './pages/cabinet/main'
import HistoryPage from './pages/history/main'
import NotificationPage from './pages/notifications/main'

import SearchTransportPage from './pages/transport/search'
import CreateTransportPage from './pages/transport/create'

import SearchAppPage from './pages/app/search'
import CreateAppPage from './pages/app/create'

import './index.css'


class Main extends React.Component{
  render(){
      return <h2>Главная</h2>;
  }
}

ReactDOM.render(
  <Router>
      <Switch>
          <Route exact path="/" component={Main} />
          <Route path="/transport/search" component={SearchTransportPage} />
          <Route path="/transport/create" component={CreateTransportPage} />

          <Route path="/app/search" component={SearchAppPage} />
          <Route path="/app/create" component={CreateAppPage} />

          <Route path="/recovery/password" component={ChangePasswordPage} />

          <Route path="/cabinet" component={CabinetPage} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/notifications" component={NotificationPage} />

          <Route path="/registration" component={RegistrationPage} />
          <Route path="/login" component={AuthPage} />
          <Route path="/recovery" component={RecoveryPage} />
          <Route path="/main" component={MainPage} />


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