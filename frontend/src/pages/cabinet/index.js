import React from 'react'

import isAuth from '../../utils/is_auth'

import ClientPage from './forms/client'
import DriverPage from './forms/driver'

import './css/index.css'


export default class CabinetPage extends React.Component {
    
    constructor() {
        super();
        this.state = {
            form: "common",    
        };
        this.changeForm = this.changeForm.bind(this)
    }

    changeForm(event) {
        event.preventDefault();

        if (this.state.form === "common") {
            this.setState({
                form: "driver",
            })
        } else{
            this.setState({
                form: "common",
            }) 
        }
    }

    async componentDidMount(){
        isAuth()
    }

    render() {
        let form;

        if (this.state.form === "common") {
            form = <ClientPage changeForm={this.changeForm}/>
        } else {
            form = <DriverPage changeForm={this.changeForm}/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}