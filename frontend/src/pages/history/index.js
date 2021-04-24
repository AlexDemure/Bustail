import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'
import TransportCard from '../../components/common/transport_card'

import sendRequest from '../../utils/fetch'

import HistoryTable from './tables/history'

import './css/index.css'

const table_columns = ["Транспорт", "Откуда - Куда", "Дата", "Цена", "Статус"]


export default class HistoryPage extends React.Component {
    constructor() {
        super()
        this.state = {
            history: null,
            transport_id: null
        }

        this.onClickHandler = this.onClickHandler.bind(this)
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

    onClickHandler(e, transport_id) {
        
        this.setState({
            transport_id: transport_id
        })
    }

    render() {
        return (
            <div className="container history">
                <Header previous_page="/main" page_name="История"/>
                <div className="history__table">
                    <HistoryTable
                        table_columns={table_columns}
                        table_rows={this.state.history}
                        onClickHandler={this.onClickHandler}
                    />
                </div>
                { 
                    this.state.transport_id && 
                    <TransportCard
                    transport_id={this.state.transport_id}
                    onClose={() => this.setState({transport_id: null})}
                    />
                }
                <NavBar/>
            </div>
        )
    }
    
}
