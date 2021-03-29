import './css/main.css'

import RecoveryForm from '../../components/forms/recovery/main'
import PreviewBanner from '../../components/common/preview_banner'

function RecoveryPage() {
    return (
        <div className="container">
            <PreviewBanner/>
            <RecoveryForm/>
            <div className="footer"></div>
        </div>
    )
}

export default RecoveryPage