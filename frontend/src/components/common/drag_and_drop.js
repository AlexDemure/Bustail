import React, {useState} from 'react'

import './css/drag_and_drop.css'

const DragAndDrop = (props) => {
    const [drag, setDrag] = useState(false)
    const [file_path, fileReader] = useState(null)

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
        let files = [...e.dataTransfer.files]

        saveFile(files[0])

        showPreviewFile(files[0])
    }

    function uploadHandler(e) {
        e.preventDefault()
        let files = [...e.target.files]

        saveFile(files[0])

        showPreviewFile(files[0])
    }

    function showPreviewFile(file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            fileReader(reader.result);
          }
        
        reader.readAsDataURL(file);
    }

    function saveFile(file) {
        setDrag(false);
        props.saveFile(file, true)
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
                    {
                        file_path &&
                        <img alt="preview" src={file_path}/>
                    }
                  </div>
                : <div
                    className="drag-drop__drop-area"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                  >
                    <p>Перетащите файлы или нажмите на форму (размер файла до 5МБ)</p>
                    <input type="file" onChange={(e) => uploadHandler(e)}></input>
                    {
                        file_path &&
                        <img alt="preview" src={file_path}/>
                    }
                  </div>
            }
        </div>
    )
}

export default DragAndDrop