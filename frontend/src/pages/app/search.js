import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import TicketItem from '../../components/common/ticket'


import './css/search.css'


const tickets = [
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

function SearchAppPage() {
    return (
        <div className="container search-app">
            <Header previous_page="/main" page_name="Поиск заявки"/>
            <SearchInput options={cities}/>
            <div className="apps">
                {
                    tickets.map(
                        (ticket) => <TicketItem ticket={ticket}/>
                    )
                }
            </div>
            <NavBar/>
        </div>
    )
}

export default SearchAppPage