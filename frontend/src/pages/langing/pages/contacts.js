import React from 'react'

import ContactsFeedBackForm from '../forms/form_contacts'

import './css/base.css'
import './css/contacts.css'
import { Link } from 'react-router-dom'


function ContactsPage(props) {
    return (
        <div className="contacts page">
            <div className="footer">
                <Link to="/docs/privecy.docx" download target="_blank" className="docs">Политика конфиденциальности</Link>
                <Link to="/docs/terms.docx" download target="_blank" className="docs">Пользовательское соглашение</Link>
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
                
            </div>
            <ContactsFeedBackForm/>
        </div>
    )
}

export default ContactsPage