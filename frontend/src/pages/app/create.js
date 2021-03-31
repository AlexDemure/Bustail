import React from 'react'

import './css/create.css'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import CreateAppForm from '../../components/forms/app/create'


const cities = [
    "Челябинск", "Уфа", "Москва"
]

const app_types = [
    "Свадьба", "Межгород", "Вахта"
]


function CreateAppPage() {
    return (
        <div className="container create-app">
            <Header previous_page="/main" page_name="Создание заявки"/>
            <CreateAppForm 
            cities={cities}
            app_types={app_types}
            />
            <NavBar/>
        </div>
        
    )
}

export default CreateAppPage