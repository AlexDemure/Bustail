import React from 'react'
import "./css/search_selector.css"
import './css/base.css'


export default class SearchInput extends React.Component {

    constructor(props) {

        super(props);

        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.choiceValue = this.choiceValue.bind(this);

        this.state = {
            result: [],
            value: ""
        }
    }

    choiceValue = (e) =>  {
        this.setState({
            value: e.currentTarget.textContent,
            result: []
        })

    }
    keyUpHandler(e) {

        let emptyArray = [];

        let userData = e.target.value;
        
        if (userData === '') {
            if (this.state.result.length > 0) {
                this.setState({
                    result: [],
                    value: userData
                });
            }
        }

        if (userData) {
            emptyArray = this.props.options.filter(
                (data) => {
                    return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
                }
            );
            
            emptyArray = emptyArray.map(
                (data) => {
                    return data = <li key={data} onClick={this.choiceValue}>{data}</li>;
                }
            )
            if (emptyArray.length === 0) {
                emptyArray.push(<li><span>Не найдено...</span></li>);
            }

            this.setState({
                result: emptyArray,
                value: userData
            });

        }
    }

    
    render() {
        return (
            <div className={"search-selector " + (this.state.result.length ? "active" : "")}>
                <input
                className="search-selector__input__common" 
                name={this.props.name}
                type="text"
                size="45"
                placeholder={this.props.placeholder ? this.props.placeholder : "Введите название города"}
                onChange={this.keyUpHandler}
                value={this.state.value}>
                </input>
                
                <div className="option">
                  {this.state.result}
                </div> 
            </div>
        )
    }
    
}

