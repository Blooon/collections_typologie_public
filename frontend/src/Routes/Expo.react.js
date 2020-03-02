import React from 'react';
import requestUtils from '../Utils/request.utils';
import { Link } from 'react-router-dom';

export default class Expo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            expo : {
                files: [],
                images: [],
                name: 'none',
                description:'none',
                
            },
            imgId: 0,
        }
        this.loadExpo = this.loadExpo.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.LeftRightImage = this.LeftRightImage.bind(this);
        this.loadExpo();
    }

    async loadExpo() {
        try {
            const body = await requestUtils.get(`/expo/${this.props.match.params.expoId}`);
            this.setState({
                expo: body.data
            })
        }
        catch(err) {
            console.log(err);
            this.setState({ error: err.message })
        }
    }

    changeImg() {
        const sens = (this.state.cursorState === 'prev') ? -1: +1;
        let imgId = this.state.imgId + sens
        if (imgId === this.state.expo.images.length) {
            imgId = 0
        }
        else if (imgId === -1) {
            imgId = this.state.expo.images.length - 1;
        }
        this.setState({imgId})
    }

    LeftRightImage(e) {
        if (e.clientY >= e.target.y && e.clientY <= e.target.y + e.target.height) {
            if (e.clientX >= e.target.x && e.clientX <= e.target.x + e.target.width /2) {
                this.setState({ cursorState: 'prev' })
            }
            else if (e.clientX >= e.target.x && e.clientX <= e.target.x + e.target.width) {
                this.setState({ cursorState: 'next' })                
            }
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

        let img = null;
        if (this.state.expo.images.length > 0) {
            img = <img
                    className={"w3-image " + this.state.cursorState}
                    onMouseMove={this.LeftRightImage}
                    onClick={e => this.changeImg()}
                    alt={this.state.expo.name}
                    src={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.expo.images[this.state.imgId].large}
                    sizes="(max-width: 1175px) 100vw, 1175px"
                    srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.expo.images[this.state.imgId].small+" 536w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.expo.images[this.state.imgId].medium+" 928w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.expo.images[this.state.imgId].large+" 1175w"}/>
        }
    
        return <>
            <section className="expo-section">
                <div className="noto w3-center">{this.state.error}</div>
                <aside className="caption expo-caption-wide w3-left w3-container w3-padding-24 w3-hide-medium w3-hide-small">
                    <h1 className="w3-container">{this.state.expo['name' + this.props.lang]}</h1>
                    <p className="w3-container">{this.renderContent(this.state.expo['description' + this.props.lang])}</p>
                    <p className="w3-container"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow"/> <Link to={"/books/" + this.state.expo.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
                </aside>
                <div className="slideshow expo-image  w3-col l10 w3-center w3-container w3-padding-24">
                    {img}
                </div>
                <aside className="caption w3-container w3-padding-24 w3-hide-large">
                    <h1 className="w3-container">{this.state.expo['name' + this.props.lang]}</h1>
                    <p className="w3-container">{this.renderContent(this.state.expo['description' + this.props.lang])}</p>
                    <p className="w3-container"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow"/> <Link to={"/books/" + this.state.expo.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
                </aside>
            </section>
        </>
    }
}