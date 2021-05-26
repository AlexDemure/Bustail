import './css/base.css'
import './css/zoom.css'

export default function ZoomPhoto(props) {
    return (
        <div className="zoom-photo modal-window__bg" onClick={props.onClick}>
            <img 
                src={props.file_uri}
                alt="preview"
                className="zoomed-photo"
            ></img>
        </div>
    )
}
