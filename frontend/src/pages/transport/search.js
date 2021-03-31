import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import SearchInput from '../../components/common/inputs/search_selector'
import TransportItem from '../../components/common/transport'

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

function SearchTransportPage() {
    return (
        <div className="container search-transport">
            <Header previous_page="/main" page_name="Поиск транспорта"/>
            <SearchInput options={cities}/>
            <div className="transports">
                {
                    transports.map(
                        (transport) => <TransportItem transport={transport}/>
                    )
                }
            </div>
            <NavBar/>
        </div>
    )
}

export default SearchTransportPage