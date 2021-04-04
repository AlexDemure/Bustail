import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import TicketItem from '../../components/common/tickets/ticket_search'
import TransportItem from '../../components/common/transports/transport_offer'

import './css/search.css'


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
   },
   {
    "from": "Челябинск", "to": "Москва", "date": "16.10.21",
    "price": 16000, "type_app": "Свадьба", "seats": 24,
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

const cities = tickets.map(
    (ticket) => {
        return ticket.from
    }
)

const me_transports = [
    {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Челябинск",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Москва",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Москва",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Москва",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
]

const me_transport_in_html =  me_transports.map(
    (transport) => <TransportItem transport={transport}/>
)


function SearchAppPage() {
    return (
        <div className="container search-app">
            <Header previous_page="/main" page_name="Поиск заявки"/>
            <SearchInput options={cities}/>
            <div className="apps">
                {
                    tickets.map(
                        (ticket) => <TicketItem choices={me_transport_in_html} ticket={ticket}/>
                    )
                }
            </div>
            <NavBar/>
        </div>
    )
}

export default SearchAppPage