import './css/base.css'

import DefaultInput from '../../common/inputs/default'

import SendFormBtn from '../../common/buttons/send_form_btn'
import AuthSwitch from '../../common/swithes/auth'

function AuthMainForm() {
    return (
        <form>
           <AuthSwitch is_active="login"/>
           <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
           <DefaultInput input_type="password" size="25" placeholder="Пароль"/>
           <SendFormBtn value="Войти"/>
        </form>
    )
}

export default AuthMainForm
