import React from 'react'

import DefaultInput from '../../../components/common/inputs/default'
import SearchInput from '../../../components/common/inputs/search_selector'
import TextAreaInput from '../../../components/common/inputs/textarea'
import SubmitButton from '../../../components/common/buttons/submit_btn'
import DragAndDrop from '../../../components/common/drag_and_drop'

import { getCities } from '../../../constants/cities'
import { selectErrorInputs, validateImageFile } from '../../../constants/input_parsers'

import sendRequest from '../../../utils/fetch'
import { uploadFile } from '../../../utils/upload_file'

import SerializeForm from '../../../utils/form_serializer'


class ImageFormCreateTransport extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isUploaded: false,
            file: null,
            error: null,
        }

        this.uploadCover = this.uploadCover.bind(this);
        this.saveFile = this.saveFile.bind(this)
    }

    saveFile(file, isUploaded) {
        this.setState({
            isUploaded: isUploaded,
            file: file,
        })
    }

    async uploadCover(event) {
        event.preventDefault();
        console.log(this.state);

        if (this.state.file) {
            let isCorrect = validateImageFile(this.state.file)
            if (!isCorrect) {
                this.setState({
                    isUploaded: false,
                    file: null,
                    error: "Файл должен быть формата jpeg, image, png"
                })
                return
            } else {
                let url = `/api/v1/drivers/transports/${this.props.transport.id}/covers/`
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
                            error: error.message
                        })
                    }
                )
            
            }
        }
        
    }

    render() {
        return (
            <form className="create-transport__form__upload-cover" onSubmit={this.uploadCover}>
            <DragAndDrop saveFile={this.saveFile}/>
            {
                this.state.error && 
                <div className="create-transport__form__upload-cover__error-text">
                    <p>{this.state.error}</p>
                </div>
            }
            <SubmitButton className={this.state.isUploaded ? "" : "disabled"} value="Далее"/>
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
                
                <DefaultInput name="brand" input_type="text" size="25" placeholder="Марка"/>
                <DefaultInput name="model" input_type="text" size="25" placeholder="Модель"/>
                <DefaultInput name="count_seats" input_type="number" size="12" placeholder="Пассажиров"/>
                <DefaultInput name="state_number" input_type="text" size="12" placeholder="Гос номер"/>
                <SubmitButton value="Далее"/>
            </form>
        )
    }
}

function AdditionalFormCreateTransport(props) {
    return (
        <form className="create-transport__form__additional-info" onSubmit={props.onSubmit}>
            <TextAreaInput name="description" rows="5" placeholder="Описание автомобиля (не обязательно)"/>
            <DefaultInput name="price" input_type="number" size="25" placeholder="Стоимость в час (Не обязательно)"/>
            <SubmitButton value="Далее"/>
        </form>
    )
}


export default class CreateTransportForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            form: "main",
            transport: null,
            error: null,
        };
        this.mainCard = this.mainCard.bind(this);
        this.additionalCard = this.additionalCard.bind(this);
        
    }

    
    mainCard(event) {
        event.preventDefault();

        let prepared_data = SerializeForm(event.target, new FormData(event.target))
        
        let data = {
            brand: prepared_data.get("brand"),
            model: prepared_data.get("model"),
            count_seats: parseInt(prepared_data.get("count_seats")),
            city: prepared_data.get("city"),
            state_number: prepared_data.get("state_number"),
        }

        console.log(data);
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
                this.setState({error: error.message})

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                }
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

        sendRequest(`/api/v1/drivers/transports/${this.state.transport.id}`, "PUT", data)
        .then(
            (result) => {
                this.setState({
                    form: "upload"
                })
            },
            (error) => {
                this.setState({error: error.message})

                if (error.name === "ValidationError") {
                    selectErrorInputs(error.message)
                }
            }
        )
    }

    render() {
        let form;

        if (this.state.form === "main") {
            form = <MainFormCreateTransport onSubmit={this.mainCard}/>
        } else if (this.state.form === "additional") {
            form = <AdditionalFormCreateTransport onSubmit={this.additionalCard}/>
        } else {
            form = <ImageFormCreateTransport
            changePage={this.props.changePage}
            transport={this.state.transport}/>
        }

        return (
            <React.Fragment>
                {form}
            </React.Fragment>
        )
    }
}