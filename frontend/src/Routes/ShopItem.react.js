import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import { Link } from 'react-router-dom';

export default class ShopItem extends React.Component {
    constructor(props) {
        super(props);
        this.addItemToBasket = this.addItemToBasket.bind(this);
    }

    async addItemToBasket(itemId) {
        try {
            const body = await requestUtils.post('/shop/' + itemId + "/item");
            this.props.setBasket(body.basket);
        }
        catch (err) {
            console.log(err);
        }
    }

    handleClickBuyItem(index, itemId, e){
        var res = this.addItemToBasket(itemId)
        const buyButton = e.currentTarget
        buyButton.disabled = true
        buyButton.classList.remove('hover-black-2px')
        buyButton.getElementsByTagName('u')[0].classList.add('blinking-2px')
        setTimeout(() => { 
            buyButton.getElementsByTagName('u')[0].classList.remove('blinking-2px')
            buyButton.classList.add('hover-black-2px')
            let objets = this.state.items.slice();
            let item = objets[index]
            if (res) {
                item.printSuccess = true;
            } else {
                item.printFail = true;
            }
            let itemInBasket = this.props.basket.items.find(function (objet) {
                return (objet.id === item.id)
            })
            if (itemInBasket.amount === item.stock) {
                item.status = 'sold out'
            } else {
                buyButton.disabled = false
            }
            this.setState({items: objets});
        }, 1500);
        setTimeout(() => {
            let objets = this.state.items.slice();
            let item = objets[index]
            item.printSuccess = false;
            item.printFail = false;
            this.setState({items: objets});
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
        const { item, index } = this.props;

        let status = null;
        if (item.status === 'pre-order'){
            status = (this.props.lang === '_fr') ? 'précommander' : 'pre-order'
        } else if (item.status === 'sold out') {
            status = (this.props.lang === '_fr') ? 'épuisé' : 'sold out'
        } else {
            status = (this.props.lang === '_fr') ? 'acheter' : 'purchase'
        }

        let success = null;
        if (item.printSuccess) {
            success = <p className="result margin-auto">{(this.props.lang === '_fr') ? 'article ajouté à votre panier ↗' : 'product added to your basket ↗'}</p>
        }

        let fail = null;
        if (item.printFail) {
            fail = <p className="result margin-auto">{(this.props.lang === '_fr') ? 'erreur, veuillez réessayer' : 'error, please try again'}</p>
        }

        let medium_width = item.shop_width && item.shop_width > 1 ? 12 : 6;
        let large_width = item.shop_width ? (item.shop_width > 3 ? 12 : 4*item.shop_width) : 4;
        
        return <article key={item.id} className={`w3-col m${medium_width} l${large_width} w3-center w3-padding-16 w3-padding`}>
            <Link to={`/items/${item.id}`} alt={`${item['name' + this.props.lang]}`}>
                <img className="w3-image" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + item.sticker} alt={item['name' + this.props.lang]}/>
            </Link>
            <h2>{item['type' + this.props.lang]}</h2>
            <p>{item['name' + this.props.lang]}</p>
            <p>{this.renderContent(item['description' + this.props.lang])}</p>
            <p className="shop-price">{item.price} euros</p>
            <button disabled={(item.status === 'sold out')} className={(item.status === 'sold out') ? "buy-button margin-auto cursor-default" : "buy-button margin-auto hover-black-2px"} onClick={(e) => this.handleClickBuyItem(index, item.id, e)}><u>{status}</u></button>
            {success}
            {fail}
        </article>
    }
}