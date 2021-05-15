import React from 'react'
import { withRouter } from 'react-router'
import { getCompanyCardByUrl } from '../../components/common/api/company_card'

class CompanyPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            company: {
                company_name: null
            }
        }
    }

    async componentDidMount() {
        let company = await getCompanyCardByUrl(this.props.match.params.page_url)
        this.setState({
            company: company
        })
    }

    render() {
        console.warn(this.props);
        return (
            <div>
                <h1>Hello</h1>
                <h2>{this.state.company.company_name}</h2>
            </div>
        )
    }
}


export default withRouter(CompanyPage)