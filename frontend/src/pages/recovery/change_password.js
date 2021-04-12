import PreviewBanner from '../../components/common/preview_banner'

import RecoveryForm from './forms/change_password'

import './css/index.css'

function ChangePasswordPage() {
    return (
        <div className="container recovery">
            <PreviewBanner/>
            <RecoveryForm/>
            <div className="recovery__footer"></div>
        </div>
    )
}

export default ChangePasswordPage