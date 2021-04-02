import './css/history.css'

function HistoryTable(props) {
    return (
        <table className="history_table">
            <thead className="columns">
                <tr>
                    {
                        props.table_columns.map(
                            (item) => <th>{item}</th>
                        )
                    }
                </tr>
            </thead>
            <tbody className="rows">
                    {
                        props.table_rows.map(
                            (item) => 
                            <tr>
                                <td><a href="#">{item.transport}</a></td>
                                <td>{item.from}</td>
                                <td>{item.to}</td>
                                <td>{item.date}</td>
                                <td>{item.price}</td>
                                <td>
                                   <div className={item.status}></div>
                                </td>
                            </tr>
                        )
                    }
            </tbody>
        </table>
    )
}

export default HistoryTable
