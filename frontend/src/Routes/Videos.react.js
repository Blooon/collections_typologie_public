import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import { Link } from 'react-router-dom';

export default class Videos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            videos: [],
            index: 0
        }
        this.loadVideos = this.loadVideos.bind(this);
        this.loadVideos();
    }

    async loadVideos() {
        try {
            const body = await requestUtils.get('/videos');
            this.setState({
                videos: body.data
            })
            this.setState({index: body.data.length});
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }
    
    changeSrc(video) {
        const tmp = video.cover;
        video.cover = video.back;
        video.back = tmp
        this.setState({
            videos: this.state.videos
        })
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

    renderArticle(index, width){
        const video = this.state.videos[index];
        return <article key={video.id} className={"w3-col l"+width+" w3-padding-16"}>
            <Link to={"/videos/" + video.id}>
                <img className="w3-image" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + video.cover} alt={video['name' + this.props.lang]} onMouseOver={(event) => this.changeSrc(video)} onMouseOut={(event) => {this.changeSrc(video)}} />
            </Link>
            <h1 className="title w3-center">{video['name' + this.props.lang]}</h1>
            <p className="w3-center">{this.renderContent(video['description' + this.props.lang])}</p>
            <p className="w3-container w3-hide-large"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow"/> <Link to={"/books/" + video.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
        </article>
    }

    renderSection(index, size){
        if (size === 3) {
            return <section key={index} className="expo-index margin-16px">
                {this.renderArticle(index, 4)}
                {this.renderArticle(index+1, 4)}
                {this.renderArticle(index+2, 4)}
            </section>
        } else if (size === 2) {
            return <section key={index} className="expo-index margin-15pc">
                {this.renderArticle(index, 6)}
                {this.renderArticle(index+1, 6)}
            </section>
        } else {
            return <section key={index} className="expo-index margin-15pc">
                {this.renderArticle(index, 12)}
            </section>
        }
    }

    render() {
        const videos = this.state.videos;
        const size = videos.length;
        const rest = size % 3;
        let sections = [];
        var i = 0;
        for (i; (size-i) !== rest; i+=3) {
            sections.push(this.renderSection(i, 3));
        }
        if (rest !== 0) {
            sections.push(this.renderSection(i, rest));
        }
        return <div className="w3-row w3-center w3-padding-16">
            {sections}
        </div>
    }
}