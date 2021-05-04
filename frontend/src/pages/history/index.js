import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'
import ClientCard from '../../components/common/client_card'

import sendRequest from '../../utils/fetch'

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

    async getHistory() {
        let history;
        await sendRequest('/api/v1/applications/history/', "GET")
        .then(
            (result) => {
                console.log(result)
                history = result
            },
            (error) => {
                console.log(error)
                history = null
            }
        )
        return history
    }

    async componentDidMount() {
        let history = await this.getHistory()
        this.setState({
            history: history
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
