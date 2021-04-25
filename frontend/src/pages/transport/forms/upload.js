import React from 'react'


import SubmitButton from '../../../components/common/buttons/submit_btn'
import DragAndDrop from '../../../components/common/drag_and_drop'
import { validateImageFile } from '../../../constants/input_parsers'


export default class ImageFormCreateTransport extends React.Component {
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

    uploadCover(event) {
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
                sendRequest(`/api/v1/drivers/transports/${this.props.transport.id}/covers/`, "GET")
                .then(
                    (result) => {
                        this.setState({
                            page: "create",
                            driver: {
                                account_id: result.account_id,
                                id: result.id
                            }
                        })
                    },
                    (error) => {
                        console.log(error.message);
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