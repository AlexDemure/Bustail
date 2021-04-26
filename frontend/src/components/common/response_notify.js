import React from 'react'

import './css/response_notify.css'


export function showNotify() {
    let element = document.getElementsByClassName("response-notify__common__border")[0]
    element.style.opacity = "1"
    setTimeout(() => {
        element.style.opacity = "0"
    }, 5000);
}


export function ResponseNotify(props) {
    return (
        <div className={"response-notify__common__border " + props.notify_type}>
            <div className="response-notify__common__content">
                <div className={"response-notify__common__detail " + props.notify_type}></div>
                <p className={"response-notify__common__text " + props.notify_type}>{props.text}</p>
                <div className={"response-notify__common__close-btn"}></div>
            </div>
        </div>
    )
}
