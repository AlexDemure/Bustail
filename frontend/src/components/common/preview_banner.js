import './css/preview_banner.css'


function PreviewBanner() {
    return (
        <div className="preview-banner__common" onClick={() => window.location.replace('/')}>
            <h1 className="preview-banner__common__title">bustail</h1>
            <h2 className="preview-banner__common__description">сервис пассажирских перевозок</h2>
        </div>
    )
}

export default PreviewBanner