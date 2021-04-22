import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import { aboutMe } from '../../components/common/api/about_me'
 
import CreateAppForm from './forms/create'

import isAuth from '../../utils/is_auth'

import './css/create.css'


export default class CreateAppPage extends React.Component {
    constructor() {
        super()
    }

    async componentDidMount(){
        isAuth()
        await aboutMe()
    }

    render() {
        return (
            <div className="container create-app">
                <Header previous_page="/main" page_name="Создание заявки"/>
                <CreateAppForm/>
                <NavBar/>
            </div>
        )
    }
    
}
