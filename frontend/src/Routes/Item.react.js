import React from 'react';
import requestUtils from '../Utils/request.utils';
import { Link } from 'react-router-dom';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            item : {
                name: 'none',
                description: 'none',
                format: 'none',
                type: 'none',
                price: 'none',
                typologie: 'none',
                status: 'none',
                images: []
            },
            items: [],
            imgId: 0,
            more: false,
            printSuccess: false,
            printFail: false            
        }
        this.loadItem = this.loadItem.bind(this);
        this.changeImg = this.changeImg.bind(this);
        this.LeftRightImage = this.LeftRightImage.bind(this);
        this.addItemToBasket = this.addItemToBasket.bind(this);
        this.loadItem();
    }

    async addItemToBasket(itemId) {
        try {
            const body = await requestUtils.post('/shop/' + itemId + "/item");
            this.props.setBasket(body.basket);
        }
        catch (err) {
            console.log(err)
        }
    }

    handleClickBuyItem(itemId, e){
        var res = this.addItemToBasket(itemId)
        const buyButton = e.currentTarget
        buyButton.disabled = true
        buyButton.classList.remove('hover-black-2px')
        buyButton.getElementsByTagName('u')[0].classList.add('blinking-2px')
        setTimeout(() => { 
            buyButton.getElementsByTagName('u')[0].classList.remove('blinking-2px')
            buyButton.classList.add('hover-black-2px')
            let objet = this.state.item;
            let itemInBasket = this.props.basket.items.find(function (item) {
                return (objet.id === item.id)
            })
            if (itemInBasket.amount === objet.stock) {
                objet.status = 'sold out'
            } else {
                buyButton.disabled = false
            }
            if (res) {
                this.setState({item: objet, printLanguage: false, printSuccess: true})
            } else {
                this.setState({item: objet, printLanguage: false, printFail: true})
            }
        }, 1500);
        setTimeout(() => {
            this.setState({printFail: false, printSuccess: false});
        }, 3000);
    }
    
    async loadItem() {
        try {
            const body = await requestUtils.get(`/item/${this.props.match.params.itemId}`);
            let objet = body.data
            let itemInBasket = this.props.basket.items.find(function (item) {
                return (item.id === objet.id)
            })
            if (objet.stock < 0) {
                objet.status = 'pre-order'
            } else if (objet.stock === 0) {
                objet.status = 'sold out'
            } else if (itemInBasket) {
                if (itemInBasket.amount === objet.stock) {
                    objet.status = 'sold out'
                }
            } else {
                objet.status = 'purchase'
            }
            this.setState({
                item: objet
            });
        }
        catch(err) {
            this.setState({ error: err.message })
        }
    }

    changeImg() {
        const sens = (this.state.cursorState === 'prev') ? -1: +1;
        let imgId = this.state.imgId + sens
        if (imgId === this.state.item.images.length) {
            imgId = 0
        }
        else if (imgId === -1) {
            imgId = this.state.item.images.length - 1;
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
        if (this.state.item.images.length > 0) {
            img = <img
                    className={"w3-image " + this.state.cursorState}
                    onMouseMove={this.LeftRightImage}
                    onClick={e => this.changeImg()}
                    alt={this.state.item.name}
                    src={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.item.images[this.state.imgId].large}
                    sizes="(max-width: 1175px) 100vw, 1175px"
                    srcSet={process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.item.images[this.state.imgId].small+" 536w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.item.images[this.state.imgId].medium+" 928w,"+
                            process.env.REACT_APP_S3_BUCKET_BASE_URL + this.state.item.images[this.state.imgId].large+" 1175w"}/>
        }

        let status = null;
        if (this.state.item.status === 'pre-order'){
            status = (this.props.lang === '_fr') ? 'précommander' : 'pre-order'
        } else if (this.state.item.status === 'sold out') {
            status = (this.props.lang === '_fr') ? 'épuisé' : 'sold out'
        } else {
            status = (this.props.lang === '_fr') ? 'acheter' : 'purchase'
        }

        let success = null;
        if (this.state.printSuccess) {
            success = <p className="book-result">{(this.props.lang === '_fr') ? 'article ajouté à votre panier ↗' : 'product added to your basket ↗'}</p>
        }

        let fail = null;
        if (this.state.printFail) {
            fail = <p className="book-result">{(this.props.lang === '_fr') ? 'erreur, veuillez réessayer' : 'error, please try again'}</p>
        }

        return <>
            {/* Item section : the page of shop item that's not a book */}
            <section className="item-section w3-row">
                <div className="noto w3-center">{this.state.error}</div>

                {/* Item caption */}            
                <aside className="caption w3-left w3-container w3-padding-24 w3-hide-medium w3-hide-small">
                    <h1 className="w3-container">{this.state.item['name'+ this.props.lang]}</h1> {/* Item name */}
                    <p className="w3-container">{this.renderContent(this.state.item['caption'+ this.props.lang])}</p> {/* Item description */}
                    <p className="w3-container"> {/* Link to typology */}
                        <img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow" />
                        <Link to={"/books/"+this.state.item.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link>
                    </p>
                    <button disabled={(this.state.item.status === 'sold out')} className={(this.state.item.status === 'sold out') ? "buy-button price cursor-default w3-container" : "buy-button price hover-black-2px w3-container"} onClick={(e)=> this.handleClickBuyItem(this.state.item.id, e)}> {/* Item price */}
                        {this.state.item.price}€<br/><u>{status}</u> {/* <!-- Item status --> */}
                    </button>
                    {success}
                    {fail}
                </aside>

                {/* Item image */}
                <div className="slideshow expo-image w3-col l9 w3-center w3-container w3-padding-24">
                    {img}
                </div>

                <aside className="caption w3-left w3-container w3-padding-24 w3-hide-large">
                    <h1 className="w3-container">{this.state.item['name'+ this.props.lang]}</h1> {/* Item name */}
                    <p className="w3-container">{this.renderContent(this.state.item['caption'+ this.props.lang])}</p> {/* Item description */}
                    <p className="w3-container"> {/* Link to typology */}
                        <img className="more-arrow" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/arrow.svg"} alt="arrow" />
                        <Link to={"/books/"+this.state.item.number} className="more-button">{(this.props.lang === '_fr') ? 'voir le livre' : 'see the book'}</Link>
                    </p>
                    <button disabled={(this.state.item.status === 'sold out')} className={(this.state.item.status === 'sold out') ? "buy-button price cursor-default w3-container" : "buy-button price hover-black-2px w3-container"} onClick={(e)=> this.handleClickBuyItem(this.state.item.id, e)}> {/* Item price */}
                        {this.state.item.price}€<br/><u>{status}</u> {/* <!-- Item status --> */}
                    </button>
                    {success}
                    {fail}
                </aside>

            </section>
        </>
    }

}