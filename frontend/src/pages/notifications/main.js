import React from 'react'

import './css/main.css'

import NotificationSwitch from '../transport/components/notification'
import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportItem from '../../components/common/transports/transport_notification'
import TicketNotification from '../../components/common/tickets/ticket_notification'


const transports = [
    {
    "id": 1,
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Челябинск",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "id": 2,
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Москва",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   }
]
const tickets = [
    {
    "from": "Челябинск", "to": "Москва", "date": "16.10.21",
    "price": 16000, "type_app": "Свадьба", "seats": 24, "description": "Hellodsadasd"
   },
   {
    "from": "Челябинск", "to": "Москва", "date": "16.10.21",
    "price": 16000, "type_app": "Свадьба", "seats": 24,
   },
   {
    "from": "Челябинск", "to": "Москва", "date": "16.10.21",
    "price": 16000, "type_app": "Свадьба", "seats": 24,
   }
]


function TransportForm(props) {
    return (
        <div className="transports">
           {
                transports.map(
                    (transport) => <TransportItem rejectOffer={props.rejectOffer} transport={transport}/>
                )
            }
        </div>
    )
}

function AppForm(props) {
    return (
        <div className="apps">
            {
                tickets.map(
                    (ticket) => <TicketNotification ticket={ticket}/>
                )
            }
        </div>
    )
}



export default class NotificationPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "transport",
            transports: transports,
            apps: tickets,

        };
        
        this.changeForm = this.changeForm.bind(this)
    }

    changeForm(event) {
        event.preventDefault();

        if (this.state.form === "app") {
            this.setState({
                form: "transport",
            })
        } else{
            this.setState({
                form: "app",
            }) 
        }
    }

    rejectOffer(transport_id) {
        // event.preventDefault();
        let transports = this.state.transports;

        let result = transports.filter(transport => transport.id !== transport_id)
        console.log(result)
        this.setState({
            transports: result
        })
    }

    render() {
        let form;

        if (this.state.form === "transport") {
            form = <TransportForm rejectOffer={this.rejectOffer}/>
        }else {
            form = <AppForm />
        }

        return (
            <div className="container notifications">
                <Header previous_page="/main" page_name="Уведомления"/>
                <NotificationSwitch
                is_active={this.state.form}
                onClick={this.changeForm}
                count_transports={transports.length}
                count_apps={tickets.length}
                />
                {form}
                <NavBar/>
            </div>
        )
    }
}