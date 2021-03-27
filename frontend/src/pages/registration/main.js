import './css/main.css'

import RegistrationMainForm from '../../components/forms/registration/main'
import PreviewBanner from '../../components/common/preview_banner'

function RegistrationMainPage() {
    return (
        <div className="container">
            <PreviewBanner/>
            <div className="form">
                <RegistrationMainForm/>
            </div>
            <div className="footer"></div>
        </div>
    )
}

export default RegistrationMainPage