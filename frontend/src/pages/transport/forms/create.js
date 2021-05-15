import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import DragAndDrop from '../../../components/common/drag_and_drop'

import { ResponseNotify, showNotify } from '../../../components/common/response_notify'

import { getCities } from '../../../constants/cities'
import { transportTypes } from '../../../constants/transport_types'

import { selectErrorInputs, validateImageFile } from '../../../constants/input_parsers'

import sendRequest from '../../../utils/fetch'
import { uploadFile } from '../../../utils/upload_file'

import SerializeForm from '../../../utils/form_serializer'


class ImageFormCreateTransport extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <form className="create-transport__form__upload-cover" onSubmit={this.props.uploadCover}>
            <DragAndDrop saveFile={this.props.saveFile}/>
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

                <DefaultInput name="brand" input_type="text" size="25" placeholder="Марка"/>
                <DefaultInput name="model" input_type="text" size="25" placeholder="Модель"/>
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
            <TextAreaInput name="description" rows="5" placeholder="Описание автомобиля"/>
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
            file: null,

            transport_types: null,
            transport_types_list: null,

            response_text: null,
            notify_type: null,
            error: null
        };

        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
        this.uploadCover = this.uploadCover.bind(this);
        this.saveFile = this.saveFile.bind(this)
        
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

    saveFile(file, isUploaded) {
        this.setState({
            isUploaded: isUploaded,
            file: file,
        })
    }

    uploadCover(event) {
        event.preventDefault();
        console.log(this.state);

        if (this.state.file) {
            let isCorrect = validateImageFile(this.state.file)
            if (!isCorrect) {
                this.setState({
                    isUploaded: false,
                    file: null,
                    
                    response_text: "Файл должен быть формата jpeg, image, png",
                    error: "Файл должен быть формата jpeg, image, png",
                    notify_type: "error"
                })
                showNotify()
                return

            } else {
                let url = `/api/v1/drivers/transports/${this.state.transport.id}/covers/`
                let data  = new FormData();
                data.append("file", this.state.file, this.state.file.name)
                
                uploadFile(url, data)
                .then(
                    (result) => {
                        this.props.changePage("notify")
                    },
                    (error) => {
                        this.setState({
                            isUploaded: false,
                            file: null,
                            
                            response_text: error.message,
                            error: error.message,
                            notify_type: "error"
                        })
                        showNotify()
                    }
                )
            
            }
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
            saveFile={this.saveFile}
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