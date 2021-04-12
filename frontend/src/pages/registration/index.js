import RegistrationForm from './forms/registration'
import PreviewBanner from '../../components/common/preview_banner'

import './css/index.css'

function RegistrationPage() {
    return (
        <div className="container registration">
            <PreviewBanner/>
            <RegistrationForm/>
            <div className="registration__footer"></div>
        </div>
    )
}

export default RegistrationPage