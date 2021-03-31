import './css/main.css'

import AuthForm from '../../components/forms/auth/main'
import PreviewBanner from '../../components/common/preview_banner'

function AuthPage() {
    return (
        <div className="container auth">
            <PreviewBanner/>
            <div className="form">
                <AuthForm/>
                <p id="reset_password">Забыли пароль? <a href="/recovery">Восстановить</a></p>
            </div>
            <div className="footer"></div>
        </div>
    )
}

export default AuthPage