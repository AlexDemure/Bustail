import './css/main.css'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

function MainPage() {
    return (
        <div className="container">
            <Header/>
            <div className="menu">
                <div className="create_app">
                    <p>Создать заявку</p>
                </div>
                <div className="create_transport">
                    <p>Предложить аренду</p>
                </div>
                <div className="find">
                    <div id="text">
                        <p>Поиск</p>
                    </div>
                    <div id="transport">
                        <p>Транспорт</p>
                    </div>
                    <div id="apps">
                        <p>Заказы</p>
                    </div>
                </div>
                <div className="cabinet">
                    <p>Личный кабинет</p>
                </div>
            </div>
            <NavBar/>
        </div>
    )
}

export default MainPage