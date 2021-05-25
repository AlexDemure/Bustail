import React from 'react'

import { getMeAccountCard } from '../../components/common/api/account/me'
 
import CreateAppForm from './forms/create'

import isAuth from '../../utils/is_auth'

import './css/create.css'


export default class CreateAppPage extends React.Component {

    async componentDidMount(){
        isAuth()
        await getMeAccountCard()
    }

    render() {
        return (
            <React.Fragment>
                <CreateAppForm/>
            </React.Fragment>
        )
    }
    
}
