import React from 'react';
import requestUtils from '../Utils/request.utils';

export default class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            basket: this.props.basket,
            random: true
        }
        this.onTypologieChange  = this.onTypologieChange.bind(this);
        this.onItemChange  = this.onItemChange.bind(this);
        this.changeStep = this.changeStep.bind(this);
        this.removeTypologie = this.removeTypologie.bind(this);
        this.removeItem = this.removeItem.bind(this);

    }

    async onTypologieChange(event, typologie) {
        // typologie.amount = event.target.value;
        try {
            const body = await requestUtils.put('/shop',{
                typologieId: typologie.id,
                amount: parseInt(event.target.value) ? parseInt(event.target.value): 0,
                lang: this.props.lang
            });
            this.props.setBasket(body.basket)
        }
        catch(err) {
            console.log(err);
            this.setState({error: err.message});
        }
    }

    async onItemChange(event, item) {
        try {
            const body = await requestUtils.put('/shop',{
                itemId: item.id,
                amount: parseInt(event.target.value) ? parseInt(event.target.value): 0
            });
            this.props.setBasket(body.basket)
        }
        catch(err) {
            console.log(err);
            this.setState({error: err.message});
        }
    }

    async changeStep() {
        let nbItems= 0;
        this.props.basket.items.forEach((item) => nbItems += item.amount);
        this.props.basket.typologies.forEach((item) => nbItems += item.amount);
        if (nbItems === 0) {
            return this.setState({ error: (this.props.lang === '_fr') ? 'Votre panier est vide' : 'Your shopping cart is empty'})
        }
        this.props.setStep(1);
    }

    async removeItem(itemId) {
        try {
            const body = await requestUtils.delete('/shop/' + itemId + "/item");
            this.props.setBasket(body.basket)
            this.isEmpty();
        }
        catch(err) {
            console.log(err);
            this.setState({error: err.message});
        }
    }

    async removeTypologie(typologieId, lang) {
        try {
            const body = await requestUtils.delete('/shop/' + typologieId + "/typologie", {lang: lang})
            this.props.setBasket(body.basket)
            this.isEmpty();

        }
        catch(err) {
            console.log(err);
            this.setState({error: err.message});
        }
    }

    isEmpty(){
        let nbItems= 0;
        this.props.basket.items.forEach((item) => nbItems += item.amount);
        this.props.basket.typologies.forEach((item) => nbItems += item.amount);
        if (nbItems === 0) {
            this.setState({ error: (this.props.lang === '_fr') ? 'Votre panier est vide' : 'Your shopping cart is empty'})
        } else {
            this.setState({ error: null})
        }
    }

    componentDidMount(){
        this.isEmpty();
    }

    render() {
        let total = 0;
        const typologies = this.props.basket.typologies.map((typologie) => {
            total += typologie.amount * typologie.price;
            return <tr key={typologie.id+typologie.lang} className="basket-item">
                <td className="remove-button">
                    <button onClick={(e) => this.removeTypologie(typologie.id, typologie.lang)} className="w3-display-container">
                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="close"/>
                    </button>
                </td>
                <td className="basket-product">
                    <img className="w3-left w3-image shadow w3-section" src={process.env.REACT_APP_S3_BUCKET_BASE_URL +  typologie.shop_sticker} alt={typologie['name' + this.props.lang]} />
                    <div className="basket-description">  
                        <p className="basket-title">{(this.props.lang === '_fr') ? 'Typologie' : 'Typology'}</p>
                        <p>{typologie['name' + this.props.lang]}</p>
                        <p>{(typologie.lang === '_fr') ? ((this.props.lang === '_fr') ? 'version française' : 'french version') : ((this.props.lang === '_fr') ? 'version anglaise' : 'english version')}</p>
                    </div>
                </td>
                <td className="basket-quantity">
                    <input className="w3-input w3-bar-item w3-border" type="number" min="0" max="99" maxLength="2" size="2" name={typologie['name' + this.props.lang]} value={typologie.amount} required onChange={(e) => this.onTypologieChange(e, typologie)}/>
                </td>
                <td className="basket-price w3-right">
                    <p>{typologie.price}€</p>
                </td>
            </tr>
        });
        const items = this.props.basket.items.map((item) => {
            total += item.amount * item.price
            return <tr key={item.id} className="basket-item">
                <td className="remove-button">
                    <button onClick={(e) => this.removeItem(item.id)} className="basket-button w3-display-container">
                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="close"/>
                    </button>
                </td>
                <td className="basket-product">
                    <img className="w3-left w3-image shadow w3-section" src={process.env.REACT_APP_S3_BUCKET_BASE_URL + item.sticker} alt={item['name' + this.props.lang]}/>
                    <div className="basket-description">  
                        <p className="basket-title">{item['type' + this.props.lang]}</p>
                        <p>{item['name' + this.props.lang]}</p>
                    </div>
                </td>
                <td className="basket-quantity">
                    <input className="w3-input w3-bar-item w3-border" type="number" min="0" max="99" maxLength="2" size="2" name="Quantité" value={item.amount}  onChange={(e) => this.onItemChange(e, item)} required />
                </td>
                <td className="basket-price w3-right">
                    <p>{item.price}€</p>
                </td>
            </tr>
        })            
        let empty = null
        if (this.state.error){
            empty = <>
            {/* <div className="item w3-center">
                <div className="w3-bar">
                    <p className="w3-bar-item">{(this.props.lang === '_fr') ? 'Votre panier est vide' : 'Your cart is empty'}</p>
                </div>
            </div> */}
                <tr className="basket-item">
                    <td className="remove-button">
                    </td>
                    <td className="basket-product">
                    </td>
                    <td className="basket-quantity">
                        <p className="w3-bar-item">{this.state.error}</p>
                    </td>
                    <td className="basket-price w3-right">
                    </td>
                </tr>
            </>
        }
        return  <section className="basket-section w3-responsive">
            {/* <div className="noto w3-center">{this.state.error}</div> */}
            <table className="w3-table">
                <thead>
                    <tr id="Headings">
                        <th></th>
                        <th className="">{(this.props.lang === '_fr') ? 'Produit' : 'Product'}</th>
                        <th className="total-quantity">{(this.props.lang === '_fr') ? 'Quantité' : 'Quantity'}</th> 
                        <th className="w3-right">{(this.props.lang === '_fr') ? 'Prix' : 'Price'}</th>
                    </tr>
                </thead>
                <tbody>
                    {empty}
                    {typologies}
                    {items}
                </tbody>
            </table>
            <div id="Basket-Total">
                <div className="w3-bar w3-padding-16">
                    <p className="w3-bar-item w3-left">{(this.props.lang === '_fr') ? 'sous-total' : 'subtotal'}</p>
                    <p className="w3-bar-item w3-right">{total}€</p>
                </div>
                {/* <div className="w3-bar w3-padding-16">
                    <p className="w3-bar-item w3-left">{(this.props.lang === '_fr') ? 'expédition' : 'shipping'}</p>
                    <p className="w3-bar-item w3-right">0€</p> 
                </div>
                <div className="w3-bar w3-padding-16">
                    <p className="w3-bar-item w3-left">total</p>
                    <p className="w3-bar-item w3-right">{total + 0}€</p> 
                </div> */}
                <button className="order-button w3-right w3-padding-16" onClick={() => this.changeStep()}>{(this.props.lang === '_fr') ? 'passer la commande' : 'place the order'}</button>
            </div>
        </section>
    }
}