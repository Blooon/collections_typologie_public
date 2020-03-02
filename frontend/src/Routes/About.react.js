import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
// import scrollIntoView from 'scroll-into-view-if-needed'
// import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

export default class About extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            about: {},
            imgId: 0,
            scrolled: false
        }
        this.loadAbout = this.loadAbout.bind(this);
        this.loadAbout();
        this.scrollToText = this.scrollToText.bind(this);
    }


    async loadAbout() {
        try {
            const body = await requestUtils.get(`/abouts`);
            if (body.data.length === 0) {
                this.setState({error: 'Internal Error'})
                return ;
            }
            this.setState({
                about: body.data[0]
            })
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    componentDidMount() {
        this.setState({scrolled: true})
        this.scrollToText();
    }

    scrollToText() {
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w > 992){
                let main = document.body.getElementsByTagName('main')[0].scrollHeight;
                var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                // mainBottom : scrollHeight pour arriver au pied du main
                var mainBottom = main - h;
                window.scroll({
                    top: mainBottom,
                    // -initialScroll, 
                    left: 0, 
                    behavior: 'smooth' 
                });
        }
    }

    componentDidUpdate() {
        this.scrollToText();
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
        return <section>
            <div className="about-image w3-center w3-padding-32">
                <img
                    className={"w3-image"}
                    alt="Collections Typologie"
                    src={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.about.large}
                    sizes="(max-width: 1175px) 100vw, 1175px"
                    srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.about.small+" 536w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.about.medium+" 928w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.about.large+" 1175w"}/>
            </div>
            
            <div id="About" className="w3-row w3-container w3-padding-24">
                <article className="w3-container w3-col m6 l4">
                    <p ref={node => this.about = node}>
                        <span className="content-title">info</span>
                        {this.renderContent(this.state.about['info' + this.props.lang])}
                    </p>
                </article>

                <article className="w3-container w3-col m6 l4">
                    <p>
                        <span className="content-title">contacts</span>
                        {this.renderContent(this.state.about['contact' + this.props.lang])}
                    </p>
                </article>

                <article className="w3-container w3-col l4">
                    <p>
                        {this.renderContent(this.state.about['credits' + this.props.lang])}
                        <br/><br/>
                        {(this.props.lang === '_fr') ? 'Site conçu et dessiné par ' : 'Website designed by '}
                        <a href="http://annelisebachelier.fr/" target="_blank" rel="noopener noreferrer">Anne-Lise Bachelier</a><br/>
                        {(this.props.lang === '_fr') ? 'Développé par ' : 'Developed by '}Baptiste André {(this.props.lang === '_fr') ? 'et' : 'and'} Lorenzo Armandin
                    </p>
                </article>
            </div>
        </section> 
    }
}