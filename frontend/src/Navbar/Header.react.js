import React from 'react';
import requestUtils from '../Utils/request.utils';
import Banners from './Banners.react';


export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            news: [],
            moving: false
        }
        this.loadNews = this.loadNews.bind(this);   
        this.loadNews();
    }

    async loadNews() {
        try {
            const body = await requestUtils.get('/news');
            this.setState({
                news: body.data
            });
        }
        catch(err) {
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
        const size = this.state.news.length;
        const news = this.state.news.map((New) => {
            let banner = null;
            if (New.printBanner === 'true'){
                banner = <>
                    <p className="animation w3-col l12 w3-center">
                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow" />
                        <a className="" href={New['bannerLink' + this.props.lang]} target="_blank" rel="noopener noreferrer"> {New['banner' + this.props.lang]}</a>
                    </p>
                </>
            }
            return <article key={New.id} className={"w3-col l"+12/size}>
                <h1 className="w3-col l2">{New['title' + this.props.lang]}</h1>
                <div className="w3-col l10 w3-center">
                    <p className="first-line">{this.renderContent(New['ligne1' + this.props.lang])}</p>
                    <p>{this.renderContent(New['content' + this.props.lang])}</p>
                </div>
                {banner}
            </article>
        });

        return <>
            <header id="News" className="w3-row-padding w3-padding-16 w3-show w3-hide">
                <div className="noto w3-center">{this.state.error}</div>
                {news}
            </header>
            <Banners {...this.props} />
        </>
    }
}
