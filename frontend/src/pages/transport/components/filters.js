import React from 'react'

import SearchInput from '../../../components/common/inputs/search_selector'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import { getCities } from '../../../constants/cities'

import './css/filters.css'


export default class SearchFilters extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cities: null
        }
    }

    async componentDidMount() {
        let cities = await getCities()
        this.setState({
            cities: cities
        })
    }

    choiceElement(e) {
        let class_items;
        let element;
        
        if (e.target.tagName === "DIV") {
            element = e.target
        } else if (e.target.tagName === "P") {
            element = e.target.parentElement
        }

        class_items = element.className.split(" ")

        if (class_items[class_items.length - 1] !== "active") {
            element.className += " active"
        } else {
            let new_class = class_items.map(
                item => {
                    if (item !== "active") {
                        return item
                    } else {
                        return ""
                    }
                }
            )
            element.className = new_class.join(" ")
        }
        
    }

    render() {
        let options;
        if (this.props.options) {
            options = this.props.options
        }


        return (
            <div className="search-transport__filters__modal-window__bg">
                <div className="search-transport__filters__modal-window__content">
                    <div>
                        <p className="search-transport__filters__modal-window__title">Параметры поиска</p>
                        <div className="search-transport__filters__modal-window__close-btn" onClick={this.props.closeFilters}></div>
                    </div>
                    <form className="search-transport__filters__form" onSubmit={this.props.onSubmit}>
                        <SearchInput name="city" options={this.state.cities} value={this.props.city ? this.props.city : null} isRequired={false}/>
                        
                        {/* <div className="search-transport__filters__modal-window__owner-types">
                        <div className="owner-type individual active">
                            <p>Частное лицо</p>
                        </div>
                        <div className="owner-type company">
                            <p>Компания</p>
                        </div>
                        </div> */}
                        <div className="search-transport__filters__modal-window__transport-types">
                            {
                                options &&
                                Object.keys(options).map(
                                    key => {
                                        let class_name = "search-transport__filters__modal-window__transport-type " + key

                                        if (this.props.active_items.includes(key)) {
                                            class_name += " active"
                                        } 
                                        return <div
                                                key={key}
                                                onClick={(e) => this.choiceElement(e)}
                                                className={class_name}
                                                >
                                                    <p>{options[key]}</p>
                                                </div>
                                    }
                                    
                                )
                                
                            }
                        </div>

                        <SubmitButton value="Применить"/>
                    </form>
                    
                </div>
            </div>
        )
    }
}