import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import { Link } from 'react-router-dom';

export default class ShopBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            printLanguage: false,
            printSuccess: false,
            printFail: false,
            typologie: this.props.typologie,
        }
        this.addTypologieToBasket = this.addTypologieToBasket.bind(this);
        this.handleClickBuyBook = this.handleClickBuyBook.bind(this);
    }

    async addTypologieToBasket(lang) {
        try {
            const body = await requestUtils.post('/shop/' + this.state.typologie.id + "/typologie", { lang })
            this.props.setBasket(body.basket);
        }
        catch (err) {
            console.log(err.message);
        }
    }

    handleClickLanguage(lang, e){
        const { typologie } = this.state;
        var res = this.addTypologieToBasket(lang)
        const buyButton = e.currentTarget
        buyButton.disabled = true
        buyButton.classList.remove('hover-black-2px')
        buyButton.getElementsByTagName('u')[0].classList.add('blinking-2px')
        setTimeout(() => { 
            buyButton.getElementsByTagName('u')[0].classList.remove('blinking-2px')
            buyButton.classList.remove('hover-black-2px');
            if (res) {
                this.setState({ printSuccess: true, printLanguage: false });
            } else {
                this.setState({ printFail: true, printLanguage: false });
            }
            let livreInBasket = this.props.basket.typologies.find(function (typo) {
                return (typo.id === typologie.id && typo.lang === lang)
            })
            if (livreInBasket.amount === this.state.typologie['stock' + lang]) {
                typologie['status' + lang] = 'sold out'
            }
            this.setState({ typologie });
        }, 1500);
        setTimeout(() => {
            this.setState({ printSuccess: false, printFail: false });
            buyButton.disabled = false;
        }, 3000);
    }

    handleClickBuyBook() {
        this.setState({ printLanguage: !this.state.printLanguage })
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
        const { printLanguage, typologie } = this.state;

        let status = null;
        if (typologie.status_fr === 'pre-order' && typologie.status_en === 'pre-order'){
            status = (this.props.lang === '_fr') ? 'précommander' : 'pre-order'
        } else if (typologie.status_fr === 'sold out' && typologie.status_en === 'sold out') {
            status = (this.props.lang === '_fr') ? 'épuisé' : 'sold out'
        } else {
            status = (this.props.lang === '_fr') ? 'acheter' : 'purchase'
        }

        let fr = null;
        let en = null;
        if (typologie.status_fr === 'sold out') {
            fr = <button className="buy-button margin-auto disabled" disabled><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
        } else {
            fr = <button className="buy-button margin-auto hover-black-2px" onClick={(e) => this.handleClickLanguage('_fr', e)}><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
        }
        if (typologie.status_en === 'sold out') {
            en = <button className="buy-button margin-auto disabled" disabled><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
        } else {
            en = <button className="buy-button margin-auto hover-black-2px" onClick={(e) => this.handleClickLanguage('_en', e)}><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
        }

        let language = null;
        if (printLanguage && (status !== 'épuisé' && status !== 'sold out')) {
            language = <>
                {fr}
                {en}
            </>
        }

        let success = null;
        if (typologie.printSuccess) {
            success = <p className="result margin-auto">{(this.props.lang === '_fr') ? 'article ajouté à votre panier ↗' : 'product added to your basket ↗'}</p>
        }

        let fail = null;
        if (typologie.printFail) {
            fail = <p className="result margin-auto">{(this.props.lang === '_fr') ? 'erreur, veuillez réessayer' : 'error, please try again'}</p>
        }

        let new_sticker = null;
        if (typologie.status_fr === 'pre-order' && typologie.status_en === 'pre-order'){
            new_sticker = <div className={`${this.props.lang === '_fr' ? "new-fr" : "new-en"} new-sticker`}></div>
        }

        let medium_width = typologie.shop_width && typologie.shop_width > 1 ? 12 : 6;
        let large_width = typologie.shop_width ? (typologie.shop_width > 3 ? 12 : 4*typologie.shop_width) : 4;

        return <article key={typologie.id} className={`w3-col m${medium_width} l${large_width} w3-center w3-padding-16 w3-padding`}>
            {new_sticker}
            <Link to={`/books/${typologie.id}`} alt={typologie['name' + this.props.lang]}>
                <img className="w3-image" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + typologie.shop_sticker} alt={typologie['name' + this.props.lang]}/>
            </Link>
            <h2>{(this.props.lang === '_fr') ? 'Typologie' : 'Typology'}</h2>
            <p>{typologie['name' + this.props.lang]}</p>
            <p>{this.renderContent(typologie['shop_description' + this.props.lang])}</p>
            <p className="shop-price">{typologie.price} euros</p>
            <button
                className={(typologie.status_fr === 'sold out' && typologie.status_en === 'sold out') ? "buy-button margin-auto cursor-default" : "buy-button margin-auto hover-black-2px"}
                onClick={this.handleClickBuyBook}
            >
                <u>{status}</u>
            </button>
            {language}
            {success}
            {fail}
        </article>
    }
}