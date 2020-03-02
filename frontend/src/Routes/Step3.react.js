import React from 'react';

function calcul_fees(items, country) {
    const pays = country.toLowerCase();
    const europe_fr = ['allemagne', 'autriche', 'belgique', 'bulgarie', 'chypre', 'croatie', 'danemark', 'espagne', 'estonie', 'finlande', 'grèce', 'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'royaume-unie', 'slovaquie', 'slovénie', 'suède', 'suisse', 'tchéquie']
    const europe_en = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'denmark', 'estonia', 'finland', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'united kingdom']
    let dest;
    if (pays === 'france') {
        dest = '_france'
    } else if (europe_fr.includes(pays) || europe_en.includes(pays)) {
        dest = '_europe'
    } else {
        dest = '_world'
    }
    return Math.max.apply(Math, items.map(function(item) {return item['fee' + dest]}))
}

export default class Step3 extends React.Component{
    constructor(props) {
        super(props);
        let subtotal = 0;
        this.props.basket.items.forEach((item) => subtotal += item.price * item.amount);
        this.props.basket.typologies.forEach((item) => subtotal += item.price * item.amount);
        const items = [];

        this.props.basket.items.forEach((item) => items.push({
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.amount,
            fee_france: item.fee_france,
            fee_europe: item.fee_europe,
            fee_world: item.fee_world,
            release_date: item.release_date,
            currency: 'EUR'
        }));

        this.props.basket.typologies.forEach((item) =>items.push({
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.amount,
            fee_france: item.fee_france,
            fee_europe: item.fee_europe,
            fee_world: item.fee_world,
            release_date: item.release_date,
            currency: 'EUR'
        }));

        const fee = (this.props.user_livraison !== null ? calcul_fees(items, this.props.user_livraison.country) : calcul_fees(items, this.props.user.country)) ;
       
        this.state = {
            subtotal: subtotal,
            total: subtotal + fee,
            fee,
            items,
            printOtherAddress: this.props.user_livraison!==null,
            user: {
                lastname: '',
                firstname: '',
                country: '',
                city: '',
                address1: '',
                address2: '',
                tel: '',
                email: '',
                postal_code: '',
            }
        }
    }

    getDeliveryTime(items, country) {
        const pays = country.toLowerCase();
        const europe_fr = ['allemagne', 'autriche', 'belgique', 'bulgarie', 'chypre', 'croatie', 'danemark', 'espagne', 'estonie', 'finlande', 'grèce', 'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'royaume-unie', 'slovaquie', 'slovénie', 'suède', 'suisse', 'tchéquie']
        const europe_en = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'denmark', 'estonia', 'finland', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'united kingdom']
        let time;
        let release_date = new Date('January 1, 1970');
        for (var i = 0; i < items.length; i++) {
            if (items[i].release_date !== "" && items[i].release_date !== null && new Date(items[i].release_date) > release_date){
                release_date = new Date(items[i].release_date);
            }
        }
        if (release_date !== new Date('January 1, 1970') && release_date > new Date()) {
            time = release_date.getDate() + "/" + (release_date.getMonth()+1) + "/" + release_date.getFullYear();
            return ((this.props.lang === '_fr') ? "Date de livraison estimée : " : "Estimated delivery date : ") + time
        } else {
            if (pays === 'france') {
                time = (this.props.lang === '_fr') ? "3 à 7 jours ouvrés" : "3-7 business days"
            } else if (europe_fr.includes(pays) || europe_en.includes(pays)) {
                time = (this.props.lang === '_fr') ? "2 à 3 semaines" : "2-3 weeks"
            } else {
                time = (this.props.lang === '_fr') ? "3 à 4 semaines" : "3-4 weeks"
            }
            return ((this.props.lang === '_fr') ? "Délai de livraison estimé : " : "Estimated delivery time : ") + time
        }
    }

    render() {
        let otherAddress = null; 

        const typologies = this.props.basket.typologies.map((typologie) => {
            return <div key={typologie.id+typologie.lang} className="order-item item">
                <div className="w3-bar">
                    <p className="item-name basket-title w3-left">{(this.props.lang === '_fr') ? 'Typologie' : 'Typology'} ({typologie.lang.substring(1,3)})</p> {/* Remplacer par le type d'article : typologie pour un livre, sinon attribut type pour un objet */}
                    <p className="w3-right">{typologie.price}€</p> {/* Remplacer par le prix de l'article */}
                </div>
                <div className="w3-bar">
                    <p className="w3-left">{typologie['name' + this.props.lang]}</p> {/* Remplacer par le nom de l'article ou nom de typologie associée si objet */}
                    <p className="w3-right">x{typologie.amount}</p> {/* Remplacer par la quantité de l'article */}
                </div>
            </div>
        });

        const items = this.props.basket.items.map((item) => {
            return <div key={item.id} className="order-item item">
                <div className="w3-bar">
                    <p className="item-name basket-title w3-left">{item['type' + this.props.lang]}</p> {/* Remplacer par le type d'article : typologie pour un livre, sinon attribut type pour un objet */}
                    <p className="w3-right">{item.price}€</p> {/* Remplacer par le prix de l'article */}
                </div>
                <div className="w3-bar">
                    <p className="w3-left">{item['name' + this.props.lang]}</p> {/* Remplacer par le nom de l'article ou nom de typologie associée si objet */}
                    <p className="w3-right">x{item.amount}</p> {/* Remplacer par la quantité de l'article */}
                </div>
            </div>
        })

        /* Si l'adresse d'expéditon est différente de l'adresse de facturation */
        if (this.state.printOtherAddress) {
            otherAddress = <>
            <div id="Other-Address">
                <div className="order-other-address">
                    <p className="w3-padding-16">{(this.props.lang === '_fr') ? "Livraison à une autre adresse" : "Shipment to an other address"}</p>
                </div>
                <div className="order-heading">
                    <p className="">{(this.props.lang === '_fr') ? "détails d'expédition" : "shipping details"}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? "nom" : "last name"}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? "prénom" : "first name"}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? "pays" : "country"}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'ville' : 'city'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.city}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 1' : 'address line 1'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 2' : 'address line 2 (optional)'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.address2}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'code postal' : 'postcode'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user_livraison.postal_code}</p>
                </div>
            </div>
            </>
        }

        return  <section className="order-section w3-row w3-panel">
            <h1 id="test" className="noto w3-center w3-container">
                {(this.props.lang === '_fr') ? "Votre commande a bien été envoyée, vous recevrez un mail contenant le résumé de votre commande !" : "Your order has been placed, you will receive a mail containing the review of your order !"}
            </h1>
            <div id="Order-Form" className="order-table w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">{(this.props.lang === '_fr') ? 'détails de facturation' : 'billing details'}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'nom' : 'last name'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.lastname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'prénom' : 'first name'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.firstname}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'pays' : 'country'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.country}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'ville' : 'city'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.city}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 1' : 'address line 1'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.address1}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 2' : 'address line 2'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.address2}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'code postal' : 'postcode'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.postal_code}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'téléphone' : 'phone'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.tel}</p>
                </div>
                <div className="order-bar w3-row">
                    <p className="w3-half">{(this.props.lang === '_fr') ? 'adresse mail' : 'email address'}</p>
                    <p className="w3-right-align w3-right w3-half">{this.props.user.email}</p>
                </div>
                {otherAddress}
            </div>

            <div className="order-table w3-panel w3-col l6">
                <div className="order-heading">
                    <p className="">{(this.props.lang === '_fr') ? 'ma commande' : 'my order'}</p>
                </div>
                {typologies}
                {items}
                <div className="total-bar w3-bar">
                    <p className="w3-left">{(this.props.lang === '_fr') ? 'sous-total' : 'subtotal'}</p>
                    <p className="w3-right">{this.state.subtotal}€</p> {/* Remplacer par le sous total du panier */}
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">{(this.props.lang === '_fr') ? 'expédition' : 'shipping'}</p>
                    <p className="w3-right">{this.state.fee}€</p> {/* Remplacer par les frais d'expédition */}
                </div>
                <div className="total-bar w3-bar">
                    <p className="w3-left">total</p>
                    <p className="w3-right">{this.state.total}€</p> {/* Remplacer par le total du panier */}
                </div>
                <p>{(this.state.printOtherAddress) ? this.getDeliveryTime(this.state.items, this.props.user_livraison.country) : this.getDeliveryTime(this.state.items, this.props.user.country)}</p>
            </div>
        </section>
    }
}