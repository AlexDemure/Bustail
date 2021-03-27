import './css/base.css'

import DefaultInput from '../../common/inputs/default'
import SearchInput from '../../common/inputs/search_selector'

import SendFormBtn from '../../common/buttons/send_form_btn'
import AuthSwitch from '../../common/swithes/auth'

function RegistrationMainForm() {
    return (
        <form>
           <AuthSwitch is_active="reg"/>
           <SearchInput placeholder="Город"/>
           <DefaultInput input_type="email" size="25" placeholder="Электронная почта"/>
           <DefaultInput input_type="password" size="25" placeholder="Пароль"/>
           <SendFormBtn/>
        </form>
    )
}

export default RegistrationMainForm
