import React from 'react'

import isAuth from '../../utils/is_auth'

import CommonPage from './forms/common'
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

        if (event.target.id === "common") {
            this.setState({
                form: "common",
            })
        } else if (event.target.id == "client"){
            this.setState({
                form: "client",
            }) 
        } else {
            this.setState({
                form: "driver",
            }) 
        }
    }

    async componentDidMount(){
        isAuth()
    }

    render() {
        let form;

        if (this.state.form === "common") {
            form = <CommonPage changeForm={this.changeForm}/>
        } else if (this.state.form === "client") {
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