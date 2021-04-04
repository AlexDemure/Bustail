import './css/about.css'


function AboutCard(props) {
    return (
        <div className="transport_card">
            <div id="close_btn" onClick={props.onClick}></div>
            <div id="transport_info">
                <p className="parametr">Описание: <span>{props.description}</span></p>
            </div>

        </div>
    )
}


export default AboutCard
