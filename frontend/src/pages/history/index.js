import React from 'react'

import NavBar from '../../components/common/navbar'
import Header from '../../components/common/header'

import sendRequest from '../../utils/fetch'

import HistoryTable from './tables/history'

import './css/index.css'

const table_columns = ["Транспорт", "Откуда - Куда", "Дата", "Цена", "Статус"]


export default class HistoryPage extends React.Component {
    constructor() {
        super()
        this.state = {
            history: null
        }
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
            <div className="container history">
                <Header previous_page="/main" page_name="История"/>
                <div className="history__table">
                    <HistoryTable table_columns={table_columns} table_rows={this.state.history}/>
                </div>
                <NavBar/>
            </div>
        )
    }
    
}
