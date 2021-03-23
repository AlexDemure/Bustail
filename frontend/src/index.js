import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import TicketItem from './components/common/ticket'
import TransportItem from './components/common/transport'

const ticket = {
  "from": "Челябинск-Челябинск", "to": "Москва", "date": "16.10.21",
  "price": 16000, "type_app": "Свадьба", "seats": 24,
}

const transport = {
  "mark": "Mersedes Benz", "model": "Splinter",
  "price": 900, "seats": 24, "city": "Челябинск",
  "description": "Lorem Ipsum is simply dummy \
  text of the printing and typesetting industry. \
  Lorem Ipsum has been the industry's \
  standard dummy text ever since the 1500s, when an unknown printer", 
  "photo": "base64"
}

ReactDOM.render(
  <React.StrictMode>
    <App />
    {/* <TicketItem  ticket={ticket} /> */}
    <TransportItem transport={transport} />
    <TransportItem transport={transport} />
  </React.StrictMode>,
  document.getElementById('root')
);

