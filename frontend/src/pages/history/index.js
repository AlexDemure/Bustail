import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/modal/transport'
import ClientCard from '../../components/common/modal/client'

import { getApplicationsHistory } from '../../components/common/api/applications/history'

import HistoryTable from './tables/history'

import './css/index.css'


const table_columns = ["Транспорт", "Клиент", "Откуда - Куда", "Дата", "Цена", "Статус"]


export default class HistoryPage extends React.Component {
    constructor() {
        super()
        this.state = {
            history: null,
            transport_id: null,
            account_id: null
        }

        this.showTransportCard = this.showTransportCard.bind(this)
        this.showClientCard = this.showClientCard.bind(this)
    }

    showTransportCard(transport_id) {
        this.setState({
            transport_id: transport_id
        })
    }

    showClientCard(account_id) {
        this.setState({
            account_id: account_id
        })
    }


    async componentDidMount() {
        let history = await getApplicationsHistory()
        this.setState({
            history: history.result
        })
    }

    render() {
        return (
            <React.Fragment>
                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }

                { 
                    this.state.account_id && 
                    <ClientCard
                    account_id={this.state.account_id}
                    onClose={() => this.setState({account_id: null})}
                    />
                }

                <Header previous_page="/main" page_name="История"/>
                
                <div className="container history">
                    <div className="help">
                        <div className="help__item rejected">
                            <div id="circle"></div>
                            <p id="text">Отменена</p>
                        </div>
                        <div className="help__item confirmed">
                            <div id="circle"></div>
                            <p id="text">Подтверждена</p>
                        </div>
                        <div className="help__item progress">
                            <div id="circle"></div>
                            <p id="text">В процессе</p>
                        </div>
                        <div className="help__item completed">
                            <div id="circle"></div>
                            <p id="text">Выполнена</p>
                        </div>
                    </div>
                    <div className="history__table">
                        <HistoryTable
                            table_columns={table_columns}
                            table_rows={this.state.history}
                            showTransportCard={this.showTransportCard}
                            showClientCard={this.showClientCard}
                        />
                    </div>
                </div>

                <NavBar/>
            </React.Fragment>
            
        )
    }
    
}
