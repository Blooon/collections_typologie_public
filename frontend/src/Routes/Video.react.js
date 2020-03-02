import React from 'react';
import requestUtils from '../Utils/request.utils';
import { Link } from 'react-router-dom';
import { Player } from 'video-react';
import BigPlayButton from 'video-react/lib/components/BigPlayButton';

export default class Video extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            video : {
                name: 'none',
                description:'none',
            },
        }
        this.loadVideo = this.loadVideo.bind(this);
        this.loadVideo();
    }

    async loadVideo() {
        try {
            const body = await requestUtils.get(`/video/${this.props.match.params.videoId}`);
            this.setState({
                video: body.data
            })
            console.log(this.state.video.video);
        }
        catch(err) {
            console.log(err);
            this.setState({ error: err.message })
        }
    }

    renderContent(content) {
        if (content !== undefined && content !== null) {
            content = content.split('§')
            const render = content.map((part, index) => {
                if (index === content.length-1) {
                    return <span key={index}>{part}</span>
                }
                return <span key={index}>{part}<br/></span>
            })
            return render
        }
        return null
    }

    render() {
        
        return <>
            <section className="expo-section">
                <div className="noto w3-center">{this.state.error}</div>
                <aside className="caption expo-caption-wide w3-left w3-container w3-padding-24 w3-hide-medium w3-hide-small">
                    <h1 className="w3-container">{this.state.video['name' + this.props.lang]}</h1>
                    <p className="w3-container">{this.renderContent(this.state.video['description' + this.props.lang])}</p>
                    <p className="w3-container"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow"/> <Link to={"/books/" + this.state.video.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
                </aside>
                <div className="slideshow expo-image w3-col l9 w3-center w3-container w3-padding-24">
                    <Player
                        playsInline
                        autoPlay
                        poster={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.video.poster}
                        src={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.video.video}
                    >
                        <BigPlayButton position="center" />
                    </Player>
                </div>
                <aside className="caption w3-container w3-padding-24 w3-hide-large">
                    <h1 className="w3-container">{this.state.video['name' + this.props.lang]}</h1>
                    <p className="w3-container">{this.renderContent(this.state.video['description' + this.props.lang])}</p>
                    <p className="w3-container"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow"/> <Link to={"/books/" + this.state.video.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
                </aside>
            </section>
        </>
    }
}