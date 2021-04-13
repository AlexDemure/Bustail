import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import CreateTransportForm from './forms/create'

import './css/create.css'

const cities = [
    "Челябинск", "Уфа", "Москва"
]



function CreateTransportPage() {
    return (
        <div className="container create-transport">
            <Header previous_page="/main" page_name="Предложение аренды"/>
            <CreateTransportForm 
            cities={cities}
            />
            <NavBar/>
        </div>
        
    )
}

export default CreateTransportPage