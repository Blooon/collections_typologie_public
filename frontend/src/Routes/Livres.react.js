import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import { Link } from 'react-router-dom';
import Slider from "react-slick";

function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style }}
        onClick={onClick}
      />
    );
}

function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style }}
        onClick={onClick}
      />
    );
}

export default class Livres extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            slideIndex: 0,
            livres: []
        }
        this.loadLivres = this.loadLivres.bind(this);
        this.changeSrc = this.changeSrc.bind(this);
        this.addTypologieToBasket = this.addTypologieToBasket.bind(this);
        this.loadLivres();
    }

    async loadLivres() {
        try {
            const body = await requestUtils.get('/livres');
            let books = body.livres
            books.forEach(livre => {
                let livreFrInBasket = this.props.basket.typologies.find(function (typologie) {
                    return (typologie.id === livre.id && typologie.lang === '_fr')
                })
                let livreEnInBasket = this.props.basket.typologies.find(function (typologie) {
                    return (typologie.id === livre.id && typologie.lang === '_en')
                })
                livre.printLanguage = false;
                livre.printSuccess = false;
                livre.printFail = false;
                if (livre['stock_fr'] < 0) {
                    livre.status_fr = 'pre-order'
                } else if (livre['stock_fr'] === 0) {
                    livre.status_fr = 'sold out'
                } else if (livreFrInBasket) {
                    if (livreFrInBasket.amount === livre.stock_fr) {
                        livre.status_fr = 'sold out'
                    }
                } else {
                    livre.status_fr = 'purchase'
                }
                if (livre['stock_en'] < 0) {
                    livre.status_en = 'pre-order'
                } else if (livre['stock_en'] === 0) {
                    livre.status_en = 'sold out'
                } else if (livreEnInBasket) {
                    if (livreEnInBasket.amount === livre.stock_en) {
                        livre.status_en = 'sold out'
                    }
                } else {
                    livre.status_en = 'purchase'
                }
            });
            this.setState({
                livres: books
            })
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    async addTypologieToBasket(typologieId, lang) {
        try {
            const body = await requestUtils.post('/shop/' + typologieId + "/typologie", { lang })
            this.props.setBasket(body.basket);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }

    handleClickLanguage(index, typologieId, lang, e){
        var res = this.addTypologieToBasket(typologieId, lang)
        const buyButton = e.currentTarget
        buyButton.disabled = true
        buyButton.classList.remove('hover-black-1px')
        buyButton.getElementsByTagName('u')[0].classList.add('blinking-1px')
        setTimeout(() => { 
            buyButton.getElementsByTagName('u')[0].classList.remove('blinking-1px')
            buyButton.classList.add('hover-black-1px')
            let books = this.state.livres.slice();
            let livre = books[index]
            livre.printLanguage = false;
            if (res) {
                livre.printSuccess = true;
            } else {
                livre.printFail = true;
            }
            let livreInBasket = this.props.basket.typologies.find(function (typologie) {
                return (typologie.id === livre.id && typologie.lang === lang)
            })
            if (livreInBasket.amount === livre['stock' + lang]) {
                livre['status' + lang] = 'sold out'
            }
            this.setState({livres: books});
        }, 1500);
        setTimeout(() => {
            let books = this.state.livres.slice();
            let livre = books[index];
            livre.printSuccess = false;
            livre.printFail = false;
            this.setState({livres: books});
            buyButton.disabled = false
        }, 3000);
    }

    handleClickBuy(index){
        let books = this.state.livres.slice();
        books[index].printLanguage = !books[index].printLanguage;
        this.setState({livres: books});
    }

    changeSrc(livre) {
        const tmp = livre.cover;
        livre.cover = livre.back;
        livre.back = tmp
        this.setState({
            livres: this.state.livres
        })
    }

    handleOver(e){
        var tooltips = document.querySelectorAll('.book-cover');
        for(var i = 0; i < tooltips.length; i++) {
            tooltips[i].addEventListener('mousemove', function(e) {
                var trueTarget = e.target.parentElement
                var tooltip = trueTarget.getElementsByTagName('p')[0]
                tooltip.style.left =
                    (e.pageX + tooltip.clientWidth < document.body.clientWidth)
                        ? (e.pageX + 20 + "px")
                        : (document.body.clientWidth + 5 - tooltip.clientWidth + "px");
                tooltip.style.top =
                    (e.pageY + tooltip.clientHeight < document.body.clientHeight)
                        ? (e.pageY - 10 - tooltip.clientHeight + "px")
                        : (document.body.clientHeight - 10 + tooltip.clientHeight + "px");
            });
        }
    }

    onDragOver = (event) => {
        console.log("proc")
        event.preventDefault();
    }

    next = () => {
      this.slider.slickNext();
    }

    previous = () => {
      this.slider.slickPrev();
    }

    handleWheel = event => {
        console.log(event.deltaX, event.deltaY)
        event.preventDefault();
        event.stopPropagation();
        if (event.deltaY > 0) {
            console.log("next")
            this.next();
        } else {
            this.previous();
            console.log("prev")
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
        const settings = {
            className: "slider variable-width",
            autoplay: false,
            arrows: false,
            centerPadding: '0px',
            dots: false,
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 0.5,
            initialSlide: 0.5,
            variableWidth: false,
            swipeToSlide: true,
            nextArrow: <NextArrow />,
            prevArrow: <PrevArrow />,
            beforeChange: (current, next) => this.setState({ slideIndex: next }),
        };

        const livres = this.state.livres.map((livre,index) => {
            if (livre.printBook === "false") {
                return null;
            }
            let status = null;
            if (livre.status_fr === 'pre-order' && livre.status_en === 'pre-order'){
                status = (this.props.lang === '_fr') ? 'précommander' : 'pre-order'
            } else if (livre.status_fr === 'sold out' && livre.status_en === 'sold out') {
                status = (this.props.lang === '_fr') ? 'épuisé' : 'sold out'
            } else {
                status = (this.props.lang === '_fr') ? 'acheter' : 'purchase'
            }

            let fr = null;
            let en = null;
            if (livre.status_fr === 'sold out') {
                fr = <button className="price-index disabled" disabled><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
            } else {
                fr = <button className="price-index hover-black-1px" onClick={(e) => this.handleClickLanguage(index, livre.id, '_fr', e)}><u>{(this.props.lang === '_fr') ? 'version française' : 'french version'}</u></button>
            }
            if (livre.status_en === 'sold out') {
                en = <button className="price-index disabled" disabled><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
            } else {
                en = <button className="price-index hover-black-1px" onClick={(e) => this.handleClickLanguage(index, livre.id, '_en', e)}><u>{(this.props.lang === '_fr') ? 'version anglaise' : 'english version'}</u></button>
            }

            let language = null;
            if ((livre.printLanguage) && (status !== 'épuisé' && status !== 'sold out')) {
                language = <>
                    {fr}
                    {en}
                </>
            }

            let success = null;
            if (livre.printSuccess) {
                success = <p className="result">{(this.props.lang === '_fr') ? 'article ajouté à votre panier ↗' : 'product added to your basket ↗'}</p>
            }

            let fail = null;
            if (livre.printFail) {
                fail = <p className="result">{(this.props.lang === '_fr') ? 'erreur, veuillez réessayer' : 'error, please try again'}</p>
            }

            let new_sticker = null;
            if (livre.status_fr === 'pre-order' && livre.status_en === 'pre-order'){
                new_sticker = <div className={`${this.props.lang === '_fr' ? "new-fr" : "new-en"} new-sticker`}></div>
            }

            return <article key={livre.id} className="w3-col l4 w3-padding-16" onWheel={e => this.handleWheel(e)}>
                {new_sticker}
                <Link to={"/books/" + livre.id} className="book-cover" onMouseOver={(e) => this.handleOver(e)}>
                    <p className={"tooltip w3-text-"+livre.tooltip_color}>{livre['tooltip1' + this.props.lang]}<br/>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {livre['tooltip2' + this.props.lang]}</p>
                    <img draggable={true} onDragStart={(event) => this.onDragOver(event)} className="shadow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + livre.cover} alt={livre['name' + this.props.lang]} onMouseOver={(event) => this.changeSrc(livre)} onMouseOut={(event) => {this.changeSrc(livre)}}/>
                </Link>
                <div className="index-details w3-padding-16">
                    <div className="w3-hide-small w3-left-align w3-left">
                        <button className={(livre.status_fr === 'sold out' && livre.status_en === 'sold out') ? "price-index cursor-default" : "price-index hover-black-1px"} onClick={ () => this.handleClickBuy(index)}><u>{status}</u><br/> {livre.price}€</button>
                        {language}
                        {success}
                        {fail}
                    </div>
                    <p className="description w3-center">{this.renderContent(livre['description' + this.props.lang])} </p>
                    <div className="w3-hide-large w3-hide-medium">
                        <button className={(livre.status_fr === 'sold out' && livre.status_en === 'sold out') ? "price-index cursor-default" : "price-index hover-black-1px"} onClick={ () => this.handleClickBuy(index)}>{status} {livre.price}€</button>
                        {language}
                        {success}
                        {fail}
                    </div>
                </div>
            </article>
        })

        const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

        return <>
            <section className="carousel w3-row-padding w3-center">
                {w > 992 ? 
                    <Slider
                        className="carousel-inner"
                        ref={c => (this.slider = c)}
                        {...settings}
                    >
                        {livres}
                    </Slider>
                    :
                    livres
                }
            </section>
        </>

    }
}
