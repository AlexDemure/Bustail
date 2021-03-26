import React from 'react'
import "./css/inputs.css"

let options = [
    "Hello", "Hells", "World", "Buy"
]


export default class SearchInput extends React.Component {

    constructor() {

        super();

        this.handleLoginKeyUp = this.keyUpHandler.bind(this);
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
            emptyArray = options.filter(
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
            <div className={"search " + (this.state.result.length ? "active" : "")}>
                <input 
                type="text"
                size="45"
                placeholder="Введите название города"
                onChange={this.handleLoginKeyUp}
                value={this.state.value}>
                </input>
                
                <div className="option">
                  {this.state.result}
                </div> 
                <div className="icon"><i className="fas fa-search"></i></div>  
            </div>
        )
    }
    
}

