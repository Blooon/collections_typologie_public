import React from 'react';
import requestUtils from '../Utils/request.utils';
import '../w3.css';
import '../stylesheet.css';
import Banners from '../Navbar/Banners.react';
import ShopGrid from './ShopGrid.react';

export default class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            typologies: []
        }
        this.loadItems = this.loadItems.bind(this);
        this.loadItems();
    }

    async loadItems() {
        try {
            const resItems = await requestUtils.get('/items');
            const resTypos = await requestUtils.get('/livres');
            let books = resTypos.livres
            let tmpItems = resItems.data
            tmpItems.sort(function(a,b){
                return new Date(b.release_date) - new Date(a.release_date);
            });
            
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
            tmpItems.forEach(objet => {
                let itemInBasket = this.props.basket.items.find(function (item) {
                    return (item.id === objet.id)
                })
                objet.printSuccess = false;
                objet.printFail = false;
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
            });
            const body = await requestUtils.get('/banners');
            this.setState({
                items: tmpItems,
                typologies: books,
                banners: body.data,
            });
        }
        catch (err) {
            this.setState({ error: err.message })
        }
    }

    render() {
        return <>
            <Banners {...this.props} />
            <section id="Shop">
                <div className="noto w3-center">{this.state.error}</div>
                <ShopGrid
                    title={this.props.lang === '_fr' ? 'livres' : 'books'}
                    data={this.state.typologies}
                    typologies={true}
                    {...this.props}
                />
                <ShopGrid
                    title={this.props.lang === '_fr' ? 'objets' : 'items'}
                    data={this.state.items}
                    typologies={false}
                    {...this.props}
                />
            </section>
        </>  
    }
}