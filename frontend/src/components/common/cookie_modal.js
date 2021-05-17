import React from 'react'

import './css/cookie_modal.css'


function CookieModalWindow(props) {
    return (
        <div className="cookie__modal-window__bg">
            <div className="cookie__modal-window__content">
                <div>
                    <p className="cookie__modal-window__title">Использование Cookie на сайте</p>
                </div>
                <div className="cookie__modal-window__text">
                    <p>Используя сервис Bustail вы соглашаетесь на использование cookie</p>
                </div>
                <p className="cookie__modal-window__btn-accept" onClick={props.setCookie}>Принимаю</p>
            </div>
        </div>
    )
}


export default class CookieChecker extends React.Component {
    constructor() {
        super()

        this.state = {
            isCookie:false
        }

        this.setCookie = this.setCookie.bind(this)
    }

    setCookie() {
        var date = new Date();
        date.setTime(date.getTime() + (30*24*60*60*1000)); // 30 days
        document.cookie = `cookie_terms=yes; expires=${date.toUTCString()}; path=/`

        this.setState({
            isCookie: true
        })
    }
    
    getCookie() {
        var cookie_items = document.cookie.split(';');
        let cookie = cookie_items.filter(
            item => {
                if (item.split("=")[0].replace(" ", "") === "cookie_terms") {
                    return item
                }
            } 
        )
        return cookie
    }

    componentDidMount() {
        let cookie = this.getCookie()

        if (cookie.length > 0) {
            this.setState({
                isCookie: true
            })
        } else {
            this.setState({
                isCookie: false
            })
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.isCookie === false &&
                    <CookieModalWindow setCookie={() => this.setCookie()}/>
                }
            </React.Fragment>
        )
    }
}