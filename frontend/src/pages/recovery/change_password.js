import './css/main.css'

import RecoveryForm from '../../components/forms/recovery/change_password'
import PreviewBanner from '../../components/common/preview_banner'

function ChangePasswordPage() {
    return (
        <div className="container recovery">
            <PreviewBanner/>
            <RecoveryForm/>
            <div className="footer"></div>
        </div>
    )
}

export default ChangePasswordPage