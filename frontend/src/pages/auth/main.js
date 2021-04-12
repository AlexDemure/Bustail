import './css/main.css'

import AuthForm from '../../components/forms/auth/main'
import PreviewBanner from '../../components/common/preview_banner'

function AuthPage() {
    return (
        <div className="container auth">
            <PreviewBanner/>
            <div className="auth__body">
                <AuthForm/>
                <p className="auth__body__reset-password">Забыли пароль? <a href="/recovery">Восстановить</a></p>
            </div>
            <div className="auth__footer"></div>
        </div>
    )
}

export default AuthPage