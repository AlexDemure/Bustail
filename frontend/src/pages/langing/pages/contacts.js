import React from 'react'

import ContactsFeedBackForm from '../forms/form_contacts'

import './css/base.css'
import './css/contacts.css'
import { Link } from 'react-router-dom'


function ContactsPage(props) {
    return (
        <div className="contacts page">
            <div className="footer">
                <a href="/docs/privecy.docx" download className="docs">Политика конфиденциальности</a>
                <a href="/docs/terms.docx" download className="docs">Пользовательское соглашение</a>
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
                
            </div>
            <ContactsFeedBackForm/>
        </div>
    )
}

export default ContactsPage