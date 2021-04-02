import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import HistoryTable from '../../components/common/tables/history'

const table_columns = ["Транспорт", "Откуда", "Куда", "Дата", "Цена", "Статус"]

const table_rows = [
    {"from": "Челябинск-Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "rejected", "transport": "Pegeout Boxer", "date": "16.10.21"},
    {"from": "Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "progress", "transport": "Pegeout Boxer", "date": "16.10.21"},
    {"from": "Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "completed", "transport": "Pegeout Boxer", "date": "16.10.21"},
    {"from": "Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "rejected", "transport": "Pegeout Boxer", "date": "16.10.21"},
    {"from": "Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "progress", "transport": "Pegeout Boxer", "date": "16.10.21"},
    {"from": "Челябинск", "to": "Москва", "price": 56000, "transport_id": "12", "status": "completed", "transport": "Pegeout Boxer", "date": "16.10.21"},

]



function HistoryPage() {
    return (
        <div className="container history">
            <Header previous_page="/main" page_name="История"/>
            <div className="data">
                <HistoryTable table_columns={table_columns} table_rows={table_rows}/>
            </div>
            <NavBar/>
        </div>
    )
}

export default HistoryPage