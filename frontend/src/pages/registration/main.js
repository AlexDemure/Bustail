import './css/main.css'

import RegistrationForm from '../../components/forms/registration/main'
import PreviewBanner from '../../components/common/preview_banner'

function RegistrationPage() {
    return (
        <div className="container">
            <PreviewBanner/>
            <RegistrationForm/>
            <div className="footer"></div>
        </div>
    )
}

export default RegistrationPage