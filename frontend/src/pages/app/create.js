import React from 'react'

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
            <React.Fragment>
                <CreateAppForm/>
            </React.Fragment>
        )
    }
    
}
