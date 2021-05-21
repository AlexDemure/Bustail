import React, {useState} from 'react'

import './css/drag_and_drop.css'

const DragAndDrop = (props) => {
    const [drag, setDrag] = useState(false)
    const [files, saveFiles] = useState(null)

    function dragStartHandler(e) {
        e.preventDefault()
        setDrag(true)
    }

    function dragLeaveHandler(e) {
        e.preventDefault()
        setDrag(false)
    }

    function onDropHandler(e) {
        e.preventDefault()
        save([...e.dataTransfer.files].slice(0, 4))
    }

    function uploadHandler(e) {
        e.preventDefault()
        save([...e.target.files].slice(0, 4))
    }

    function save(files) {
        console.log(files)

        setDrag(false)
        saveFiles(files)
        props.saveFiles(files, true)
    }

    return (
        <div className="drag-drop">
            {
                drag
                ? <div
                    className="drag-drop__drop-area focused"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                    onDrop={e => onDropHandler(e)}
                  >
                    <p>Отпустите файлы, чтобы загрузить их (размер файла до 5МБ)</p>
                  </div>
                : <div
                    className="drag-drop__drop-area"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                  >
                    <p>Перетащите файлы или нажмите на форму (размер файла до 5МБ)</p>
                    <input type="file" multiple onChange={(e) => uploadHandler(e)}></input>
                  </div>
            }

            <div className={`drag-drop__preview ${files ? "show" : "hidden"}`}>
                {
                    files &&
                    files.map(
                        file => {
                            return (
                                <React.Fragment>
                                    {
                                        file.type.split('/')[0] === "image" ?
                                        <img className="drag-drop__item img" src={URL.createObjectURL(file)}></img> :
                                        <div className="drag-drop__item file">
                                            <p>{file.name}</p>
                                        </div>
                                    } 
                                </React.Fragment>
                            )
                        }
                    )
                }
            </div>
        </div>
    )
}

export default DragAndDrop