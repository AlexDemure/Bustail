import './css/history.css'

function HistoryTable(props) {
    return (
        <table>
            <thead className="history__table__columns">
                <tr>
                    {
                        props.table_columns.map(
                            (item) => <th>{item}</th>
                        )
                    }
                </tr>
            </thead>
            <tbody className="history__table__rows">
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
                                   <div className={"history__table__item__" + item.status}></div>
                                </td>
                            </tr>
                        )
                    }
            </tbody>
        </table>
    )
}

export default HistoryTable
