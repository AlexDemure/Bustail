import React from 'react'

import ContactsFeedBackForm from '../../components/forms/landing/contacts'


function ContactsPage(props) {
    return (
        <div className="contacts page">
            <ContactsFeedBackForm/>
            <div className="contacts__footer">
                <div id="preview-btn" className="anchor" onClick={props.changeForm}></div>
            </div>
        </div>
    )
}

export default ContactsPage