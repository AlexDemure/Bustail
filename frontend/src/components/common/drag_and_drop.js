import React, {useState} from 'react'

import './css/drag_and_drop.css'

const DragAndDrop = (props) => {
    const [drag, setDrag] = useState(false)

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
        console.log(files);
        saveFile(files[0])
    }

    function uploadHandler(e) {
        e.preventDefault()
        let files = [...e.target.files]
        console.log(files);
        saveFile(files[0])
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
                  </div>
                : <div
                    className="drag-drop__drop-area"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                  >
                      <p>Перетащите файлы или нажмите на форму (размер файла до 5МБ)</p>
                      <input type="file" onChange={(e) => uploadHandler(e)}></input>
                  </div>
            }
        </div>
    )
}

export default DragAndDrop