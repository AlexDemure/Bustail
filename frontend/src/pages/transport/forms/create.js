import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import DragAndDrop from '../../../components/common/drag_and_drop'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import { getCities } from '../../../constants/cities'
import { getCars } from '../../../constants/cars'
import { transportTypes } from '../../../constants/transport_types'

import { selectErrorInputs, validateImageFile } from '../../../constants/input_parsers'

import sendRequest from '../../../utils/fetch'
import { uploadFile } from '../../../utils/upload_file'

import SerializeForm from '../../../utils/form_serializer'



class ChoiceCar extends React.Component {
    constructor() {
        super()
        this.state = {
            isChoised: false,
            
            cars: [],
            brands: [],
            models: [],
        }
        
        this.choiceBrand = this.choiceBrand.bind(this)
    }

    choiceBrand(e, value) {
        let models = Object.keys(this.state.cars).filter(key => key === value).map(key => this.state.cars[key])
                    
        this.setState({
            isChoised: true,
            models: models[0]
        })
    }

    async componentDidMount() {
        let cars = await getCars()
        this.setState({
            cars: cars,
            brands: Object.keys(cars).map(
                key => key
            )
        })
    }

    render() {
        return (
            <React.Fragment>
                <SearchInput name="brand" placeholder="Марка" choiceValue={this.choiceBrand} options={this.state.brands}/>
                <SearchInput name="model" placeholder="Модель" isDisabled={this.state.isChoised === false ? true : false} options={this.state.models}/>
            </React.Fragment>
        )
    }

}

class ImageFormCreateTransport extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <form className="create-transport__form__upload-cover" onSubmit={this.props.uploadCover}>
            <DragAndDrop saveFiles={this.props.saveFiles}/>
            <SubmitButton className={this.props.isUploaded ? "" : "disabled"} value="Далее"/>
        </form>
        )
    }

}

class MainFormCreateTransport extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            cities: []
        }
    }
    async componentDidMount(){
        let cities = await getCities()
        this.setState({cities: cities})
    }

    render() {
        return (
            <form className="create-transport__form__create-transport" onSubmit={this.props.onSubmit} autoComplete="off">
                <SearchInput name="city" placeholder="Город" options={this.state.cities}/>
                <SearchInput name="transport_type" placeholder="Тип транспорта" options={this.props.transport_types}/>
                <ChoiceCar/>               
                <DefaultInput name="count_seats" maxLength={4} input_type="number" size="4" placeholder="Пассажиров"/>
                <DefaultInput name="state_number" input_type="text" size="12" placeholder="Гос номер"/>
                <SubmitButton value="Далее"/>
            </form>
        )
    }
}

function AdditionalFormCreateTransport(props) {
    return (
        <form className="create-transport__form__additional-info" onSubmit={props.onSubmit}>
            <TextAreaInput name="description" size="5" placeholder="Описание автомобиля"/>
            <DefaultInput name="price" input_type="number" maxLength={7} size="7" placeholder="Стоимость в час"/>
            <SubmitButton value="Далее"/>
        </form>
    )
}


export default class CreateTransportForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            form: "main",
            owner: this.props.owner,
            driver: this.props.driver || null,
            company: this.props.company || null,

            transport: null,
            
            isUploaded: false,
            files: null,

            transport_types: null,
            transport_types_list: null,

            response_text: null,
            notify_type: null,
            error: null
        };

        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
        this.uploadCover = this.uploadCover.bind(this);
        this.saveFiles = this.saveFiles.bind(this)
        
    }

    
    mainCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let transport_types = this.state.transport_types
        let transport_type;

        Object.keys(transport_types).forEach(
            function(key) {
                if (transport_types[key] === prepared_data.get("transport_type")) {
                    transport_type = key
                }
            }
         );

        let data = {
            driver_id: this.state.driver !== null ? this.state.driver.id : null,
            company_id: this.state.company !== null ? this.state.company.id : null,
            brand: prepared_data.get("brand"),
            model: prepared_data.get("model"),
            count_seats: parseInt(prepared_data.get("count_seats")),
            city: prepared_data.get("city"),
            state_number: prepared_data.get("state_number"),
            transport_type: transport_type || "other"
        }

        sendRequest('/api/v1/drivers/transports/', "POST", data)
        .then(
            (result) => {
                this.setState({
                    form: "additional",
                    transport: {
                        id: result.id
                    }
                })
            },
            (error) => {
                this.setState({
                    error: error.message,
                    notify_type: "error"
                })

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                    this.setState({
                        response_text: "Не корректно заполнены данные",
                    })
                } else {
                    this.setState({
                        response_text: error.message,
                    })
                }
                showNotify()
            }
        )
    }

    additionalCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let data = {
            description: prepared_data.get("description") !== "" ? prepared_data.get("description") : null,
            price: parseInt(prepared_data.get("price")),
        }

        sendRequest(`/api/v1/drivers/transports/${this.state.transport.id}/`, "PUT", data)
        .then(
            (result) => {
                this.setState({
                    form: "upload"
                })
            },
            (error) => {
                this.setState({
                    error: error.message,
                    notify_type: "error"
                })

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                    this.setState({
                        response_text: "Не корректно заполнены данные",
                    })
                } else {
                    this.setState({
                        response_text: error.message,
                    })
                }
                showNotify()
            }
        )
    }

    saveFiles(files, isUploaded) {
        this.setState({
            isUploaded: isUploaded,
            files: files,
        })
    }

    uploadCover(event) {
        let error;

        event.preventDefault();
        
        if (this.state.files) {
            
            // Проверка на тип
            this.state.files.forEach(
                function(file) {
                    let isCorrect = validateImageFile(file)
                    console.log("Check", isCorrect)

                    if (!isCorrect) {
                        error = true
                        return
                    }
                }
            )
            
            if (error) {
                
                this.setState({
                    isUploaded: false,
                    file: null,
                    
                    response_text: "Файлы должны быть формате jpeg, image, png",
                    error: "Файлы должны быть формате jpeg, image, png",
                    notify_type: "error"
                })

                showNotify()
                return
            }

            let url = `/api/v1/drivers/transports/${this.state.transport.id}/covers/`
            let data  = new FormData();
            this.state.files.forEach(
                function(file) {
                    data.append("files", file, file.name)
                    console.log("Append")
                }
            )
            
            uploadFile(url, data)
            .then(
                (result) => {
                    this.props.changePage("notify")
                },
                (error) => {
                    this.setState({
                        isUploaded: false,
                        files: null,
                        
                        response_text: error.message,
                        error: error.message,
                        notify_type: "error"
                    })
                    showNotify()
                }
            )
            
        }
        
    }

    async componentDidMount(){
        let transport_types = await transportTypes()
        let transport_types_list = [] // Формирование в стиле [] для SearchInput

        Object.keys(transport_types).forEach(
            function(key) {
                transport_types_list.push(transport_types[key])
            }
         );
         
        this.setState({
            transport_types: transport_types,
            transport_types_list: transport_types_list
        })
    }

    render() {
        let form;

        if (this.state.form === "main") {
            form = <MainFormCreateTransport transport_types={this.state.transport_types_list} onSubmit={this.mainCard}/>
        } else if (this.state.form === "additional") {
            form = <AdditionalFormCreateTransport onSubmit={this.additionalCard}/>
        } else {
            form = <ImageFormCreateTransport
            changePage={this.props.changePage}
            transport={this.state.transport}
            uploadCover={this.uploadCover}
            saveFiles={this.saveFiles}
            isUploaded={this.state.isUploaded}
            />
        }

        return (
            <React.Fragment>
                <ResponseNotify
                notify_type={this.state.notify_type}
                text={this.state.response_text}
                />
                {form}
            </React.Fragment>
        )
    }
}