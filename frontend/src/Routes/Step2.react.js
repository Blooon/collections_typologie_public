import React from 'react';
import requestUtils from '../Utils/request.utils';

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

export default class Step2 extends React.Component{
    constructor(props) {
        super(props);
        let subtotal = 0;
        this.onChange = this.onChange.bind(this);
        this.onChangeLivraison = this.onChangeLivraison.bind(this);
        this.sendToServer = this.sendToServer.bind(this);
        this.calc_fees = this.calc_fees.bind(this);

        this.props.basket.items.forEach((item) => subtotal += item.price * item.amount);
        this.props.basket.typologies.forEach((item) => subtotal += item.price * item.amount);

        const items = [];
        this.props.basket.items.forEach((item) => items.push({
            name: item.name,
            price: item.price,
            description: item.description,
            quantity: item.amount,
            fee_france: item.fee_france,
            fee_europe: item.fee_europe,
            fee_world: item.fee_world,
            release_date: item.release_date,
            currency: 'EUR'
        }));
        this.props.basket.typologies.forEach((item) => items.push({
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
        
        this.state = {
            token: null,
            subtotal: subtotal,
            total: subtotal,
            fee: 0,
            items,
            printOtherAddress: false,
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
            },
            user_livraison: {
                lastname: '',
                firstname: '',
                country: '',
                city: '',
                address1: '',
                address2: '',
                postal_code: ''
            },
            placing_order: false
        }

    }

    onChange(event) {
        const user = this.state.user;
        user[event.target.name]= event.target.value;
        if (event.target.name === 'country') {
            const fee = calcul_fees(this.state.items, this.state.user.country);
            const total = this.state.subtotal + fee;
            this.setState({ fee, total });
        }
        this.setState({ user });
    }

    onChangeLivraison(event) {
        const user_livraison = this.state.user_livraison;
        user_livraison[event.target.name]= event.target.value;
        if (event.target.name === 'country') {
            const fee = calcul_fees(this.state.items, this.state.user_livraison.country);
            const total = this.state.subtotal + fee;
            this.setState({ fee, total });
        }
        this.setState({ user_livraison });
    }

    calc_fees(bool) {
        if (bool) {
            const fee = calcul_fees(this.state.items, this.state.user_livraison.country);
            const total = this.state.subtotal + fee;
            this.setState({ fee, total });            
        }                                                
        else {
            const fee = calcul_fees(this.state.items, this.state.user.country);
            const total = this.state.subtotal + fee;
            this.setState({ fee, total });
        }        
    }

    getDeliveryTime(items, country) {
        const pays = country.toLowerCase();
        const europe_fr = ['allemagne', 'autriche', 'belgique', 'bulgarie', 'chypre', 'croatie', 'danemark', 'espagne', 'estonie', 'finlande', 'grèce', 'hongrie', 'irlande', 'italie', 'lettonie', 'lituanie', 'luxembourg', 'malte', 'pays-bas', 'pologne', 'portugal', 'roumanie', 'royaume-uni', 'slovaquie', 'slovénie', 'suède', 'suisse', 'tchéquie']
        const europe_en = ['austria', 'belgium', 'bulgaria', 'croatia', 'cyprus', 'czechia', 'denmark', 'estonia', 'finland', 'germany', 'greece', 'hungary', 'ireland', 'italy', 'latvia', 'lithuania', 'luxembourg', 'malta', 'netherlands', 'poland', 'portugal', 'romania', 'slovakia', 'slovenia', 'spain', 'sweden', 'switzerland', 'united kingdom']
        let time;
        let release_date = new Date('January 1, 1970');
        for (var i = 0; i < items.length; i++) {
            if (items[i].release_date !== "" && items[i].release_date !== null && new Date(items[i].release_date) > release_date){
                release_date = new Date(items[i].release_date);
            }
        }
        if (release_date > new Date('January 1, 1970')) {
            time = release_date.getDate() + "/" + (release_date.getMonth()+1) + "/" + release_date.getFullYear();
            return ((this.props.lang === '_fr') ? "Date de livraison estimé : " : "Estimated delivery date : ") + time
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

    async sendToServer(token) {
        try {            
            await requestUtils.post('/payment',{
                token: token.id,
                user: this.state.user,
                user_livraison: this.state.printOtherAddress ? this.state.user_livraison : null
            });
            this.props.setValidatedBasket(this.props.basket, this.state.user , this.state.printOtherAddress ? this.state.user_livraison : null);
        }
        catch(err) {
            console.log(err.message);
            this.setState({error: err.message[(this.state.lang === "_fr") ? "fr" : 'en'], placing_order: false})
            setTimeout(()=> this.setState({error: null}), 3000)
        }
    }

    componentDidMount() {
        const stripe = window.Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE);
            const elements = stripe.elements();
            var style = {
                base: {
                // Add your base input styles here. For example:
                fontSize: '16px',
                color: "#32325d",
                }
            };
              
            // Create an instance of the card Element.
            var card = elements.create('card', {style: style});
              
            // Add an instance of the card Element into the `card-element` <div>.
            card.mount('#card-element');
            card.addEventListener('change', (event) => {
                var displayError = document.getElementById('card-errors');
                if (event.error) {
                  displayError.textContent = event.error.message;
                } else {
                  displayError.textContent = '';
                }
            });
            var form = document.getElementById('payment-form');
            form.addEventListener('submit', (event) => {
                this.setState({ placing_order: true });
                event.preventDefault();
                
                stripe.createToken(card, {
                    name: `${this.state.user.firstname} ${this.state.user.lastname}`,
                })
                .then((result) => {
                    if (result.error) {
                        // Inform the customer that there was an error.
                        var errorElement = document.getElementById('card-errors');
                        errorElement.textContent = result.error.message;
                        this.setState({ placing_order: false });
                    } else {
                        // Send the token to your server.
                        var form = document.getElementById('payment-form');
                        var hiddenInput = document.createElement('input');
                        hiddenInput.setAttribute('type', 'hidden');
                        hiddenInput.setAttribute('name', 'stripeToken');
                        hiddenInput.setAttribute('value', result.token.id);
                        form.appendChild(hiddenInput);
                        this.sendToServer(result.token, {})
                    }
                });
            });
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

        if (this.state.printOtherAddress) {
            otherAddress = <>
            <div id="Other-Address">
                <div className="order-heading">
                    <p className="">{(this.props.lang === '_fr') ? "détails d'expédition" : "shipping details"}</p>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half" htmlFor="name">{(this.props.lang === '_fr') ? "nom" : "last name"}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.lastname } onChange={this.onChangeLivraison} name="lastname" autoFocus required/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? "prénom" : "first name"}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.firstname } onChange={this.onChangeLivraison} name="firstname" required/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? "pays" : "country"}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.country } onChange={this.onChangeLivraison} name="country" required/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? 'ville' : 'city'}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.city } onChange={this.onChangeLivraison} name="city" required/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 1' : 'address line 1'}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.address1 } onChange={this.onChangeLivraison} name="address1" required/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 2 (optionnelle)' : 'address line 2 (optional)'}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.address2 } onChange={this.onChangeLivraison} name="address2"/>
                </div>
                <div className="order-bar w3-row">
                    <label className="w3-half">{(this.props.lang === '_fr') ? 'code postal' : 'postcode'}</label>
                    <input className="w3-right w3-half w3-input" type="text" value={this.state.user_livraison.postal_code } onChange={this.onChangeLivraison} name="postal_code" required/>
                </div>
            </div>
            </>
        }
        return  <>
            <section className="order-section w3-row w3-panel">
                <div className="noto w3-center">{this.state.error}</div>

                <form action="/charge" method="post" id="payment-form" autoComplete="on">
                    <div className="order-table w3-panel w3-col l6">
                        <div className="order-heading">
                            <p className="">{(this.props.lang === '_fr') ? 'détails de facturation' : 'billing details'}</p>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'nom' : 'last name'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.lastname} name="lastname" onChange={this.onChange} autoFocus required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'prénom' : 'first name'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.firstname} name="firstname" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'pays' : 'country'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.country} name="country" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'ville' : 'city'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.city} name="city" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 1' : 'address line 1'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.address1} name="address1" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'adresse ligne 2 (optionnelle)' : 'address line 2 (optional)'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.address2} name="address2" onChange={this.onChange}/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'code postal' : 'postcode'}</label>
                            <input className="w3-right w3-half w3-input" type="text" value={this.state.user.postal_code} name="postal_code" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'téléphone' : 'phone'}</label>
                            <input className="w3-right w3-half w3-input" type="tel" value={this.state.user.tel} name="tel" onChange={this.onChange} required/>
                        </div>
                        <div className="order-bar w3-row">
                            <label className="w3-half">{(this.props.lang === '_fr') ? 'adresse mail' : 'email address'}</label>
                            <input className="w3-right w3-half w3-input" type="email" value={this.state.user.email} name="email" onChange={this.onChange} required/>
                        </div>
                        <div className="order-other-address">
                            <input className="w3-padding-16" onClick={() => {this.setState({ printOtherAddress: !this.state.printOtherAddress}); this.calc_fees(!this.state.printOtherAddress)}} type="button" name="other-address" value={(this.props.lang === '_fr') ? "Livraison à une autre adresse ?" : "Ship to an other address ?"}/>
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

                        <p>{(this.state.printOtherAddress) ? this.getDeliveryTime(this.state.items, this.state.user_livraison.country) : this.getDeliveryTime(this.state.items, this.state.user.country)}</p>

                        {/* Finalizing order button */}

                        <div className="payment-section form-row">
                            <div className="payment-heading order-heading">
                                <p><label htmlFor="card-element">
                                {(this.props.lang === '_fr') ? 'carte de paiement' : 'credit or debit card'}
                                </label></p>
                            </div>
                            <div className="order-bar">
                                <div id="card-element"></div>
                                <div id="card-errors" role="alert"></div>
                            </div>
                            <div className="order-heading border-top-0">
                                <p className="">{(this.props.lang === '_fr') ? "En passant votre commande, vous acceptez les " : "By placing your order, you agree to Collections Typology's "}<a href="/legal#CGV">{(this.props.lang === '_fr') ? "Conditions Générales de Vente" : "conditions of use."}</a>{(this.props.lang === '_fr') ? " de Collections Typologie." : "."}</p>
                            </div>
                        </div>
                        
                        <button
                            className={
                                "order-button w3-right w3-padding-16" +
                                (this.state.placing_order ? " disabled" : "")
                            }
                            value="submit"
                            disabled={this.state.placing_order}
                        >
                            {!this.state.placing_order
                            ? this.props.lang === '_fr'
                                ? "régler ma commande"
                                : "settle my order"
                            : this.props.lang === '_fr'
                            ? "commande en cours..."
                            : "placing order..."}
                        </button>
                    </div>
                </form>

            </section>
            <button className="back-button w3-left" onClick={() => this.props.setStep(-1)}>{(this.props.lang === '_fr') ? 'retour' : 'return'}</button>
        </>
    }
}