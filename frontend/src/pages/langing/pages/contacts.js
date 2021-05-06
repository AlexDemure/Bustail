import React from 'react'

import ContactsFeedBackForm from '../forms/form_contacts'

import './css/base.css'
import './css/contacts.css'


function ContactsPage(props) {
    return (
        <div className="contacts page">
            <ContactsFeedBackForm/>
            <div className="footer">
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
            </div>
        </div>
    )
}

export default ContactsPage