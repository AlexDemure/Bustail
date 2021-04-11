import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import TransportItem from '../../components/common/transports/transport_search'
import TicketChoice from '../../components/common/tickets/ticket_choices'

import './css/search.css'

const transports = [
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
    "price": 900, "seats": 24, "city": "Питер",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Челябинск",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Уфа",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   },
   {
    "mark": "Mersedes Benz", "model": "Splinter",
    "price": 900, "seats": 24, "city": "Якутск",
    "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    "photo": "base64", "phone": "+79123456789",
    "driver": "Иванов Иван", "driver_license": "312-1251-1231"
   }
]

const cities = transports.map(
    (transport) => {
        return transport.city
    }
)


const me_apps = [
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
]

const me_apps_in_html = me_apps.map(
    (ticket) => <TicketChoice ticket={ticket}/>
)


function SearchTransportPage() {
    return (
        <div className="container search-transport">
            <Header previous_page="/main" page_name="Поиск транспорта"/>
            <SearchInput options={cities}/>
            <div className="transports">
                {
                    transports.map(
                        (transport) => <TransportItem choices={me_apps_in_html} transport={transport}/>
                    )
                }
            </div>
            <NavBar/>
        </div>
    )
}

export default SearchTransportPage