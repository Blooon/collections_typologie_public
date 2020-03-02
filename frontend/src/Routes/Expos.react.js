import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import { Link } from 'react-router-dom';

export default class Expos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            expos: [],
            index: 0
        }
        this.loadExpos = this.loadExpos.bind(this);
        this.loadExpos();
    }

    async loadExpos() {
        try {
            const body = await requestUtils.get('/expos');
            this.setState({
                expos: body.data
            })
            this.setState({index: body.data.length});
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }
    
    changeSrc(expo) {
        const tmp = expo.cover;
        expo.cover = expo.back;
        expo.back = tmp
        this.setState({
            expos: this.state.expos
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
        const expo = this.state.expos[index];
        return <article key={expo.id} className={"w3-col l"+width+" w3-padding-16"}>
            <Link to={"/exhibitions/" + expo.id}>
                <img className="w3-image" src={ process.env.REACT_APP_S3_BUCKET_BASE_URL + expo.cover} alt={expo['name' + this.props.lang]} onMouseOver={(event) => this.changeSrc(expo)} onMouseOut={(event) => {this.changeSrc(expo)}} />
            </Link>
            <h1 className="title w3-center">{expo['name' + this.props.lang]}</h1>
            <p className="w3-center">{this.renderContent(expo['description' + this.props.lang])}</p>
            <p className="w3-container w3-hide-large"><img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_FLECHES_BANNIERE_20x18px.svg"} alt="arrow"/> <Link to={"/books/" + expo.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link></p>
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
        const expos = this.state.expos;
        const size = expos.length;
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