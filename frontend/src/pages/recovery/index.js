import PreviewBanner from '../../components/common/preview_banner'

import RecoveryForm from './forms/send_code'

import './css/index.css'


function RecoveryPage() {
    return (
        <div className="container recovery">
            <PreviewBanner/>
            <RecoveryForm/>
            <div className="recovery__footer"></div>
        </div>
    )
}

export default RecoveryPage