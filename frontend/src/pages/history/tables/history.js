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
                        props.table_rows &&
                        props.table_rows.map(
                            (item) => {
                                let date_items = item.to_go_when.split("-")
                                let new_date = `${date_items[2]}.${date_items[1]}`

                                return <tr>
                                            <td><a href="#">{item.transport_name}</a></td>
                                            <td>{item.to_go_from} - {item.to_go_to}</td>
                                            
                                            <td>{new_date}</td>
                                            <td>{item.price}</td>
                                            <td>
                                            <div className={"history__table__item__" + item.application_status}></div>
                                            </td>
                                        </tr>
                            }
                            
                        )
                    }
            </tbody>
        </table>
    )
}

export default HistoryTable
