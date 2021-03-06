import React from 'react'

import "./css/search_selector.css"
import './css/base.css'


export default class SearchInput extends React.Component {

    constructor(props) {

        super(props);

        this.keyUpHandler = this.keyUpHandler.bind(this);
        this.onClick = this.onClick.bind(this)
        this.choiceValue = this.choiceValue.bind(this);
        

        this.state = {
            result: [],
            value: ""
        }
    }

    choiceValue = (e) =>  {
        e.target.offsetParent.previousElementSibling.value = e.currentTarget.textContent

        this.setState({
            value: e.currentTarget.textContent,
            result: []
        })

        if (this.props.choiceValue) {
            this.props.choiceValue(e,  e.currentTarget.textContent)
        }

    }

    keyUpHandler(e) {

        let emptyArray = [];

        let userData = e.target.value;

        if (userData === '') {
            if (this.state.result.length > 0) {
                this.setState({
                    result: this.props.options,
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
            
            this.setState({
                result: emptyArray,
                value: userData
            });

        }
    }

    onClick(e) {
        let element = document.getElementsByClassName("search-selector " + this.props.name)[0]
        
        if (e.target.className.startsWith('search-selector') && e.target.name === this.props.name) {
            element.className += " active"

            this.setState({
                result: this.props.options
            }) 

        } else {
            element.className = "search-selector " + this.props.name

            this.setState({
                result: []
            })
        }
       
    }

    componentDidMount() {
        document.addEventListener('click', this.onClick)
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClick)
    }
    
    render() {
        return (
            <div className={"search-selector " + this.props.name}>
                <input
                required={this.props.isRequired === false ? false : true} 
                className={`search-selector__input__common ${this.props.isRequired === false ? "no-required" : "required"}`}
                name={this.props.name}
                type="text"
                size="45"
                minLength="1"
                maxLength="255"
                defaultValue={this.props.value}
                placeholder={this.props.placeholder ? this.props.placeholder : "Введите название города"}
                onChange={this.keyUpHandler}
                onClick={this.onClick}
                disabled={this.props.isDisabled === true ? true : false}
                >
                </input>
                
                {
                    this.state.result.length > 0 && 
                    <div className="search-selector__option">
                        {
                        this.state.result.map(
                            (choice, index) => <li key={index} onClick={this.choiceValue}>{choice}</li>
                        )
                        }
                    </div> 

                }
               
            </div>
        )
    }
    
}

