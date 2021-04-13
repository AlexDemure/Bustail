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

        const formData = new FormData()
        formData.append('file', files[0])

        // TODO FETCH
        setDrag(false);
        props.isUploaded(true)
    }
    return (
        <div className="drag_drop">
            {
                drag
                ? <div
                    className="drop-area focused"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                    onDrop={e => onDropHandler(e)}
                  >Отпустите файлы, чтобы загрузить их</div>
                : <div
                    className="drop-area"
                    onDragStart={e => dragStartHandler(e)}
                    onDragLeave={e => dragLeaveHandler(e)}
                    onDragOver={e => dragStartHandler(e)}
                  >Перетащите файлы или нажмите на форму</div>
            }
        </div>
    )
}

export default DragAndDrop