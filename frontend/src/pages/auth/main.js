import './css/main.css'

import AuthMainForm from '../../components/forms/auth/main'
import PreviewBanner from '../../components/common/preview_banner'

function AuthMainPage() {
    return (
        <div className="container">
            <PreviewBanner/>
            <div className="form">
                <AuthMainForm/>
                <p id="reset_password">Забыли пароль? <a href="/login/reset_password">Восстановить</a></p>
            </div>
            <div className="footer"></div>
        </div>
    )
}

export default AuthMainPage