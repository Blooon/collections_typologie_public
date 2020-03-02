import React from 'react';
import requestUtils from '../Utils/request.utils';
// import { Link } from 'react-router-dom';
import scrollIntoView from 'scroll-into-view-if-needed'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

export default class Livre extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            livre : {
                files: [],
                images: [],
                name: 'none',
                description:'none',
                caption: 'none',
                content1: "test",
                content2: "test",
                content3: "test",
                cover: '',
            },
            cursorState: null,
            livres: [],
            imgId: 0,
            printLanguage: false,
            printSuccess: false,
            printFail: false
        }
        this.loadLivre = this.loadLivre.bind(this);
        this.addTypologieToBasket = this.addTypologieToBasket.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.LeftRightImage = this.LeftRightImage.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.loadLivre();
    }

    async loadLivre() {
        try {
            const body = await requestUtils.get(`/typologie/${this.props.match.params.livreId}`);
            const bodyLivres = await requestUtils.get('/typologies');
            let book = body.data

            let livreFrInBasket = this.props.basket.typologies.find(function (typologie) {
                return (typologie.id === book.id && typologie.lang === '_fr')
            })
            let livreEnInBasket = this.props.basket.typologies.find(function (typologie) {
                return (typologie.id === book.id && typologie.lang === '_en')
            })
            if (book['stock_fr'] < 0) {
                book.status_fr = 'pre-order'
            } else if (book['stock_fr'] === 0) {
                book.status_fr = 'sold out'
            } else if (livreFrInBasket) {
                if (livreFrInBasket.amount === book.stock_fr) {
                    book.status_fr = 'sold out'
                }
            } else {
                book.status_fr = 'purchase'
            }
            if (book['stock_en'] < 0) {
                book.status_en = 'pre-order'
            } else if (book['stock_en'] === 0) {
                book.status_en = 'sold out'
            } else if (livreEnInBasket) {
                if (livreEnInBasket.amount === book.stock_en) {
                    book.status_en = 'sold out'
                }
            } else {
                book.status_en = 'purchase'
            }

            this.setState({
                livre: book,
                livres: bodyLivres.data
            });
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    async addTypologieToBasket(typologieId, lang) {
        try {
            const body = await requestUtils.post('/shop/' + typologieId + "/typologie", { lang })
            this.props.setBasket(body.basket);
        }
        catch (err) {
            console.log(err)
        }
    }

    changeImg() {
        const sens = (this.state.cursorState === 'prev') ? -1: +1;
        let imgId = this.state.imgId + sens
        if (imgId === this.state.livre.images.length) {
            imgId = 0
        }
        else if (imgId === -1) {
            imgId = this.state.livre.images.length - 1;
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

    handleShow() {
        const scrollIntoViewSmoothly =
            'scrollBehavior' in document.documentElement.style
                ? scrollIntoView
                : smoothScrollIntoView

        const more = document.getElementById('More');
        var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        if (w > 992){
            scrollIntoViewSmoothly(more, { behavior: 'smooth', block: 'end', inline: 'nearest' });
        } else {
            scrollIntoViewSmoothly(more, { behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }

    handleClick(typologieId, lang, e){
        var res = this.addTypologieToBasket(typologieId, lang)
        const buyButton = e.currentTarget
        buyButton.disabled = true
        buyButton.classList.remove('hover-black-2px')
        buyButton.getElementsByTagName('u')[0].classList.add('blinking-2px')
        setTimeout(() => { 
            buyButton.getElementsByTagName('u')[0].classList.remove('blinking-2px')
            buyButton.classList.add('hover-black-1px')
            let book = this.state.livre;
            let livreInBasket = this.props.basket.typologies.find(function (typologie) {
                return (typologie.id === book.id && typologie.lang === lang)
            })
            if (livreInBasket.amount === book['stock' + lang]) {
                book['status' + lang] = 'sold out'
            }
            if (res) {
                this.setState({livre: book, printLanguage: false, printSuccess: true})
            } else {
                this.setState({livre: book, printLanguage: false, printFail: true})
            }
        }, 1500);
        setTimeout(() => {
            this.setState({printFail: false, printSuccess: false});
            buyButton.disabled = false
        }, 3000);
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
        let status = null;
        if (this.state.livre.status_fr === 'pre-order' && this.state.livre.status_en === 'pre-order'){
            status = (this.props.lang === '_fr') ? 'précommander' : 'pre-order'
        } else if (this.state.livre.status_fr === 'sold out' && this.state.livre.status_en === 'sold out') {
            status = (this.props.lang === '_fr') ? 'épuisé' : 'sold out'
        } else {
            status = (this.props.lang === '_fr') ? 'acheter' : 'purchase'
        }

        let img = null;
        if (this.state.livre.images.length > 0) {
            img = <img
                    className={"w3-image " + this.state.cursorState}
                    onMouseMove={this.LeftRightImage}
                    onClick={e => this.changeImg()}
                    alt={this.state.livre.name}
                    src={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.livre.images[this.state.imgId].large}
                    sizes="(max-width: 1251px) 100vw, 1251px"
                    srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.livre.images[this.state.imgId].small+" 568w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.livre.images[this.state.imgId].medium+" 992w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.livre.images[this.state.imgId].large+" 1251w"}/>
        }

        let fr = null;
        let en = null;
        if (this.state.livre.status_fr === 'sold out') {
            fr = <button className="buy-button price book-buy-button disabled w3-container" disabled><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
        } else {
            fr = <button className="buy-button price book-buy-button hover-black-2px w3-container" onClick={(e) => this.handleClick(this.state.livre.id, '_fr', e)}><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
        }
        if (this.state.livre.status_en === 'sold out') {
            en = <button className="buy-button price book-buy-button disabled w3-container" disabled><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
        } else {
            en = <button className="buy-button price book-buy-button hover-black-2px w3-container" onClick={(e) => this.handleClick(this.state.livre.id, '_en', e)}><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
        }

        let language = null;
        if (this.state.printLanguage && (status !== 'épuisé' && status !== 'sold out')) {
            language = <>
                {fr}
                {en}
            </>
        }

        let success = null;
        if (this.state.printSuccess) {
            success = <p className="book-result">{(this.props.lang === '_fr') ? 'article ajouté à votre panier ↗' : 'product added to your basket ↗'}</p>
        }

        let fail = null;
        if (this.state.printFail) {
            fail = <p className="book-result">{(this.props.lang === '_fr') ? 'erreur, veuillez réessayer' : 'error, please try again'}</p>
        }

        let more = null;
            more = 
            <article id="More" ref='0' className="w3-container">
                <div className="w3-row w3-container w3-padding-large w3-padding-32">
                    <div className="w3-col m6 l4 w3-container">
                        {this.renderContent(this.state.livre['content1' + this.props.lang])}
                    </div>
                    <div className="w3-col m6 l4 w3-container">
                        {this.renderContent(this.state.livre['content2' + this.props.lang])}
                    </div>
                    <div className="last-content w3-col m12 l4 w3-container">
                        {this.renderContent(this.state.livre['content3' + this.props.lang])}
                    </div>
                </div>
            </article>

        const typologies = this.state.livres.map((livre) => {
            if (livre.printBook === "false") {
                return null;
            }
            if (livre.id !== this.state.livre.id) {
                return <a key={livre.id} href={"/books/" + livre.id}><img className="book-icon w3-container w3-padding" src={ process.env.REACT_APP_S3_BUCKET_BASE_URL + livre.sticker} alt= {livre['name' + this.props.lang]} /></a>
            }
            return null
        })

        let dicount_caption = null;
        if (this.state.livre['discount_caption' + this.props.lang]) {
            dicount_caption = <>
                {this.renderContent(this.state.livre['discount_caption' + this.props.lang])}<br/><br/>
            </>
        }

        return <>
            <section id="Book" className="book-section">
                <div className="noto w3-center">{this.state.error}</div>
                <div className="main w3-cell-row w3-padding-16">
                    <aside className="caption w3-cell w3-container w3-padding-24 w3-hide-medium w3-hide-small">
                        <h1 className="w3-container">{this.state.livre['name' + this.props.lang]}</h1>
                        <p className="w3-container">{this.renderContent(this.state.livre['caption' + this.props.lang])}</p>
                        <p className="w3-container" onClick={(e) => this.handleShow()}><b className="more-icon">+</b> <u className="more-button">{(this.props.lang === '_fr') ? 'en savoir plus' : 'learn more'}</u></p>
                        <button className={(this.state.livre.status_fr === 'sold out' && this.state.livre.status_en === 'sold out') ? "buy-button price cursor-default w3-container" : "buy-button price hover-black-2px w3-container"} onClick={() => this.setState({ printLanguage: !this.state.printLanguage})}>
                            {this.state.livre.price}€<br/>
                            {dicount_caption}
                            <u>{status}</u>
                        </button>
                        {language}
                        {success}
                        {fail}
                    </aside>
                    <div className="slideshow book-image w3-cell w3-container w3-padding-24">
                        {img}
                    </div>
                    <aside className="responsive-caption caption w3-container w3-padding-24 w3-hide-large">
                        <h1 className="w3-container">{this.state.livre['name' + this.props.lang]}</h1>
                        <p className="w3-container">{this.renderContent(this.state.livre['caption' + this.props.lang])}</p>
                        <p className="w3-container" onClick={(e) => this.handleShow()}><b className="more-icon">+</b> <u className="more-button">{(this.props.lang === '_fr') ? 'en savoir plus' : 'learn more'}</u></p>
                        <button className={(this.state.livre.status_fr === 'sold out' && this.state.livre.status_en === 'sold out') ? "buy-button price cursor-default w3-container" : "buy-button price hover-black-2px w3-container"} onClick={() => this.setState({ printLanguage: !this.state.printLanguage})}>{this.state.livre.price}€<br/><u>{status}</u></button>
                        {language}
                        {success}
                        {fail}
                    </aside>
                    <aside className="book-others w3-cell w3-cell-bottom w3-container">
                        {typologies}
                    </aside>
                </div>
                {more}
            </section>
        </>
    }
}

