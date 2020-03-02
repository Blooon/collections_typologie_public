import React from 'react';
import Header from './Header.react';
import Livres from '../Routes/Livres.react';
import Videos from '../Routes/Videos.react';
import Expos from '../Routes/Expos.react';
import Video from '../Routes/Video.react';
import Expo from '../Routes/Expo.react';
import Livre from '../Routes/Livre.react';
import About from '../Routes/About.react';
import Admin from '../Routes/Admin.react';
import Basket from '../Routes/Basket.react';
import Shop from '../Routes/Shop.react';
import Item from '../Routes/Item.react';
import Legal from '../Routes/Legal.react';
import Press from '../Routes/Press.react';
import PopUp from '../Routes/PopUp.react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import request from '../Utils/request.utils'
 
import '../w3.css';
import '../stylesheet.css';
import "../video-react.css";

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signin: false,
            signup: false,
            basket: 'out',
            printBasket: false,
            printNewsletter: false,
            printSidebar: false,
            moving: false,
            scrollingDirection: 'down',
            aboutScrolled: false
        }
        
        this.logout = this.logout.bind(this);
        this.setBasketToIn = this.setBasketToIn.bind(this);
        this.setBasketToOut = this.setBasketToOut.bind(this);
    }
    
    async logout() {
        try {
            await request.get('/logout');
            this.props.logout();
        }
        catch(err) {
            console.log(err);
        }
    }

    async setBasketToIn() {
        this.state.basket = 'in';
        this.state.printBasket = false;
    }

    async setBasketToOut() {
        this.state.basket = 'out';
        this.state.printBasket = false;

    }

    componentDidMount() {
        let about = document.getElementById('About');

        if (about) {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (w > 992){
                document.body.onload = function() {
                    let main = document.body.getElementsByTagName('main')[0].scrollHeight;
                    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    // mainBottom : scrollHeight pour arriver au pied du main
                    var mainBottom = main - h;
                    window.scroll({
                        top: mainBottom,
                        // -initialScroll, 
                        left: 0, 
                        behavior: 'smooth' 
                    });
                }
            }
        }
    }

    componentDidUpdate() {
        let about = document.getElementById('About');

        if (about) {
            var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            if (w > 992){
                document.body.onload = function() {
                    let main = document.body.getElementsByTagName('main')[0].scrollHeight;
                    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
                    // mainBottom : scrollHeight pour arriver au pied du main
                    var mainBottom = main - h;
                    window.scroll({
                        top: mainBottom,
                        // -initialScroll, 
                        left: 0, 
                        behavior: 'smooth' 
                    });
                }
            }
        }
    }

    handleNewsletterClick(){
        this.setState({ printNewsletter: !this.state.printNewsletter})
        if (!this.state.printNewsletter){
            document.getElementById("Sidebar-Inside").classList.remove('sidebar-inside-normal');
            document.getElementById("Sidebar-Inside").classList.add('sidebar-inside-newsletter');
        } else {
            document.getElementById("Sidebar-Inside").classList.remove('sidebar-inside-newsletter');
            document.getElementById("Sidebar-Inside").classList.add('sidebar-inside-normal');
        }
    }

    render() {
        let user;
        let nbItems= 0;
        let total = 0;
        this.props.basket.items.forEach((item) => nbItems += item.amount);
        this.props.basket.typologies.forEach((item) => nbItems += item.amount);
        let basket = null;
        let sidebar = null;
        let footer = null;

        if (this.state.basket === 'out' && this.state.printBasket) {
            const typologies = this.props.basket.typologies.map((typologie) => {
                total += typologie.amount * typologie.price;
                return <div key={typologie.id+typologie.lang} className="item">
                    <div className="w3-bar">
                        <p className="item-type w3-bar-item w3-left">{(this.props.lang === '_fr') ? 'Typologie' : 'Typology'} ({typologie.lang.substring(1,3)})</p>
                        <p className="w3-bar-item w3-right">{typologie.price}€</p> 
                    </div>
                    <div className="w3-bar">
                        <p className="w3-bar-item w3-left">{typologie['name' + this.props.lang]}</p>
                        <p className="w3-bar-item w3-right">x{typologie.amount}</p>
                    </div>
                </div>
            });

            const items = this.props.basket.items.map((item) => {
                total += item.amount * item.price;
                return <div key={item.id} className="item">
                    <div className="w3-bar">
                        <p className="item-type w3-bar-item w3-left">{item['type' + this.props.lang]}</p> 
                        <p className="w3-bar-item w3-right">{item.price}€</p> 
                    </div>
                    <div className="w3-bar">
                        <p className="w3-bar-item w3-left">{item['name' + this.props.lang]}</p>
                        <p className="w3-bar-item w3-right">x{item.amount}</p>
                    </div>
                </div>
            });
            
            let empty = null
            if ((typologies === undefined || typologies.length === 0) && (items === undefined || items.length === 0)){
                empty = <div className="item w3-center">
                    <div className="w3-bar">
                        <p className="w3-bar-item">{(this.props.lang === '_fr') ? 'Votre panier est vide' : 'Your cart is empty'}</p>
                    </div>
                </div>
            }

            basket = <>
                <div id="Basket" className="w3-right w3-hide-medium w3-hide-small">
                    <div className="w3-panel">
                            {typologies}
                            {items}
                            {empty}
                        <div id="Total" className="w3-bar">
                            <p className="w3-bar-item w3-left">{(this.props.lang === '_fr') ? 'Sous-total' : 'Subtotal'}:</p>
                            <p className="w3-bar-item w3-right">{total}€</p>
                        </div>
                        <Link to="/basket" alt="passer commande">
                            <button onClick={() => this.setState({printBasket: !this.state.printBasket})} className="order-button w3-right w3-padding-16">
                                {(this.props.lang === '_fr') ? 'passer commande' : 'place order' }
                            </button>
                        </Link>
                    </div>
                </div>
            </>
        }
        if (this.state.printSidebar) {
           
            if (this.state.printNewsletter) {
                footer = <>
                    <div className="sidebar-button w3-bar">
                        <button className="w3-left" onClick={() => this.handleNewsletterClick()}>newsletter</button>
                    </div>
                    {/* Begin Mailchimp Signup Form */}
                    <div id="mc_embed_signup" className="">
                        <form action="https://collectionstypologie.us19.list-manage.com/subscribe/post?u=5a369da8555fc7bc5c5fd3783&amp;id=b1033bb1ea" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate w3-bar" target="_blank" noValidate autoComplete="on">
                            <div id="mc_embed_signup_scroll">
                                <div className="mc-field-group sidebar-button w3-bar">
                                    <label className="w3-left" htmlFor="mce-EMAIL">{(this.props.lang === '_fr') ? 'e-mail' : 'e-mail'} : </label>
                                    <span><input className="required email w3-right-align w3-border-0" id="mce-EMAIL" type="email" name="EMAIL" required/></span>
                                </div>
                                <div className="mc-field-group sidebar-button w3-bar">
                                    <label className="w3-left" htmlFor="mce-FNAME">{(this.props.lang === '_fr') ? 'prénom' : 'first name'} : </label>
                                    <span><input className="w3-right-align w3-border-0" id="mce-FNAME" type="text" name="FNAME"/></span>
                                </div>
                                <div className="mc-field-group sidebar-button w3-bar">
                                    <label className="w3-left" htmlFor="mce-LNAME">{(this.props.lang === '_fr') ? 'nom' : 'last name'} : </label>
                                    <span><input className="w3-right-align w3-border-0" id="mce-LNAME" type="text" name="LNAME"/></span>
                                </div>
                                <div id="mce-responses" className="clear">
                                    <div className="response" id="mce-error-response"></div>
                                    <div className="response" id="mce-success-response"></div>
                                </div>
                                {/* Real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
                                <div id="mc-donotfill" aria-hidden="true">
                                    <input type="text" name="b_5a369da8555fc7bc5c5fd3783_b1033bb1ea" tabIndex="-1"/>
                                </div>
                                <div className="clear">
                                    <input className="button sidebar-button w3-right" id="mc-embedded-subscribe" type="submit" value={(this.props.lang === '_fr') ? "s'inscrire" : "subscribe"} name="subscribe"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    {/* End mc_embed_signup */}
                </>
            } else {
                footer = <>
                    <div className="first-button w3-bar">
                        <a className="w3-left" href={this.props.textFooter.instagramLink} target="_blank" rel="noopener noreferrer">instagram</a>
                        <a className="w3-right" href={this.props.textFooter.facebookLink} target="_blank" rel="noopener noreferrer">facebook</a>
                    </div>
                    <div className="sidebar-button w3-bar">
                        <button className="w3-left" onClick={() => this.handleNewsletterClick()}>newsletter</button>
                        <a className="w3-right" href="/legal">{this.props.textFooter.legalMention}</a>
                    </div>
                    <a className="sidebar-button w3-bar-item" href={"mailto:" + this.props.textFooter.contactLink}>{this.props.textFooter.contactLink}</a>
                </>
            }

            sidebar = <>
            {/* <!-- For medium and small screens --> */}

            {/* <!-- Visible navigation when sidebar is open --> */}
            <div id="Sidebar" className="w3-sidebar w3-hide-large">
                <div id="Sidebar-Inside" className="sidebar-inside-normal">
                    <div className="w3-bar w3-padding-24 w3-padding">
                        <button onClick={(e) => this.props.changeLang()} className="language-button w3-bar-item"><u>{(this.props.lang === '_fr') ? 'en' : 'fr'}</u></button>
                        <button onClick={(e) => this.setState({ printSidebar: !this.state.printSidebar, printNewsletter: false })} className="basket-button w3-right w3-bar-item w3-display-container">
                            <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="close"/>
                        </button>
                        <Link to="/basket" alt="Basket" className="basket-button w3-right w3-bar-item w3-display-container w3-hide-small" onClick={(e) => this.setState({active: 'basket', printSidebar: !this.state.printSidebar, printNewsletter: false})}>
                            <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/basket.svg"} alt="cart"/>
                            <b className="w3-display-middle">
                                {nbItems}
                            </b>
                        </Link>
                    </div>
                    <div className="w3-bar-block">
                        <Link to="/books" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'books'})} className="first-button w3-bar-item"><u>{this.props.text.livre}</u></Link>
                        <Link to="/videos" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'videos'})} className="sidebar-button w3-bar-item"><u>{this.props.text.videos}</u></Link>
                        <Link to="/exhibitions" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'exhibitions'})} className="sidebar-button w3-bar-item"><u>{this.props.text.expositions}</u></Link>
                        <Link to="/about" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'about'})} className="sidebar-button w3-bar-item"><u>{this.props.text.about}</u></Link>
                        <Link to="/shop" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'shop'})} className="sidebar-button w3-bar-item"><u>{this.props.text.shop}</u></Link>
                        <Link to="/basket" onClick={(e) => this.setState({printSidebar: !this.state.printSidebar, printNewsletter: false, active: 'basket'})} className="sidebar-basket-button w3-bar-item w3-hide-medium"><u>{(this.props.lang === '_fr') ? 'mon panier' : 'my cart'} - {nbItems}</u></Link>
                    </div>
                    <div className="sidebar-footer w3-bar-block">
                        {footer}
                    </div>
                </div>
            </div>
            </>
        }
        return (
            <>
                <Router>
                    <>
                        <Route exact path="/" render={(props) => <Header lang={this.props.lang} {...props}/>} />

                        <main>
                            {/* <!-- Nav bar --> */}

                            {/* <!-- For large screens --> */}
                            <nav id="Topnav" className="w3-bar w3-padding-24 w3-padding" >
                                <Link to="/" className="home w3-bar-item w3-left" onClick={(e) => this.setState({sidebar: false, active: 'books'})}>{this.props.text.title}</Link>
                                <div className="w3-right w3-hide-medium w3-hide-small">
                                    <Link to="/books" className="w3-bar-item" onClick={(e) => this.setState({active: 'books'})}><u className={(this.state.active === 'books') ? 'active': null}>{this.props.text.livre}</u></Link>
                                    <Link to="/videos" className="w3-bar-item" onClick={(e) => this.setState({active: 'videos'})}><u className={(this.state.active === 'videos') ? 'active': null}>{this.props.text.videos}</u></Link>
                                    <Link to="/exhibitions" className="w3-bar-item" onClick={(e) => this.setState({active: 'exhibitions'})}><u className={(this.state.active === 'exhibitions') ? 'active': null}>{this.props.text.expositions}</u></Link>
                                    <Link to="/about" className="w3-bar-item" onClick={(e) => this.setState({active: 'about'})}><u className={(this.state.active === 'about') ? 'active': null}>{this.props.text.about}</u></Link>
                                    <Link to="/shop" className="w3-bar-item" onClick={(e) => this.setState({active: 'shop'})}><u className={(this.state.active === 'shop') ? 'active': null}>{this.props.text.shop}</u></Link>
                                    <button onClick={(e) => this.props.changeLang() } className="w3-bar-item"><u>{(this.props.lang === '_fr') ? 'En' : 'Fr'}</u></button>
                                    <button onClick={() => this.setState({ printBasket: !this.state.printBasket})} className="basket-button w3-bar-item w3-display-container">
                                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/basket.svg"} alt="cart"/>
                                        <b className="w3-display-middle">{nbItems}</b>
                                    </button>
                                </div>
                                {user}

                                {/* <!-- For medium and small screens --> */}

                                {/* <!-- Visible navigation when sidebar is open --> */}
                                {sidebar}

                                {/* <!-- Visible buttons when sidebar is closed --> */}                                
                                <div className="w3-right w3-hide-large">
                                    <Link to="/books" className={(this.state.active === 'books') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'books'})}><u className={(this.state.active === 'books') ? 'active': null}>{this.props.text.livre}</u></Link>
                                    <Link to="/videos" className={(this.state.active === 'videos') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'videos'})}><u className={(this.state.active === 'videos') ? 'active': null}>{this.props.text.videos}</u></Link>
                                    <Link to="/exhibitions" className={(this.state.active === 'exhibitions') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'exhibitions'})}><u className={(this.state.active === 'exhibitions') ? 'active': null}>{this.props.text.expositions}</u></Link>
                                    <Link to="/about" className={(this.state.active === 'about') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'about'})}><u className={(this.state.active === 'about') ? 'active': null}>{this.props.text.about}</u></Link>
                                    <Link to="/shop" className={(this.state.active === 'shop') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'shop'})}><u className={(this.state.active === 'shop') ? 'active': null}>{this.props.text.shop}</u></Link>
                                    <Link to="/basket" className={(this.state.active === 'basket') ? 'w3-bar-item w3-hide w3-show': 'w3-bar-item w3-hide'} onClick={(e) => this.setState({active: 'basket'})}><u className={(this.state.active === 'basket') ? 'active': null}>{(this.props.lang === '_fr') ? 'mon panier' : 'my cart'}</u></Link>
                                    <Link to="/basket" alt="Basket" className="basket-button w3-bar-item w3-display-container w3-hide-small" onClick={(e) => this.setState({active: 'basket'})}>
                                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/basket.svg"} alt="cart"/>
                                        <b className="w3-display-middle">{nbItems}</b>
                                    </Link>
                                    <button onClick={() => this.setState({ printSidebar: !this.state.printSidebar})} className="basket-button w3-bar-item w3-display-container">
                                        <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_BURGER_RESPONSIVE_33,5x17px.svg"} alt="open"/>
                                    </button>
                                </div>
                            </nav>

                            {/* <!-- Mini basket dropdown content --> */}
                            {basket}

                            <div className="noto w3-center">{this.state.error}</div>
                            <Route exact path="/" render={(props) => <Livres
                                basket={this.props.basket}
                                setBasket={this.props.setBasket}
                                lang={this.props.lang}
                                {...props}/>} />
                            <Route exact path="/books" render={(props) => <Livres
                                setBasket={this.props.setBasket} 
                                basket={this.props.basket}
                                lang={this.props.lang}
                                {...props}/>} />
                            <Route exact path="/videos" render={(props) => <Videos lang={this.props.lang} {...props}/>} />
                            <Route exact path="/exhibitions" render={(props) => <Expos lang={this.props.lang} {...props}/>} />
                            <Route path="/admin" render={(props) => <Admin lang={this.props.lang} {...props}/>} />
                            <Route path="/about" render={(props) => <About lang={this.props.lang} {...props}/>} />
                            <Route path="/account" render={(props) => <About lang={this.props.lang} {...props}/>} />
                            <Route path="/topics" render={(props) => <Livres lang={this.props.lang} {...props}/>} />
                            <Route path="/legal" render={(props) => <Legal lang={this.props.lang} {...props}/>} />
                            <Route path="/press" render={(props) => <Press lang={this.props.lang} {...props}/>} />
                            <Route path="/basket" render={(props) =><Basket 
                                setBasket={this.props.setBasket}
                                basket={this.props.basket}
                                setBasketToIn={this.setBasketToIn}
                                setBasketToOut={this.setBasketToOut}
                                lang={this.props.lang}
                                {...props} />} />
                            <Route path="/shop" render={(props) => <Shop
                                basket={this.props.basket}
                                setBasket={this.props.setBasket}
                                lang={this.props.lang}
                                {...props} /> } />
                            <Route path="/videos/:videoId" render={(props) => <Video lang={this.props.lang} {...props}/>} />
                            <Route path="/exhibitions/:expoId" render={(props) => <Expo lang={this.props.lang} {...props}/>} />
                            <Route path="/books/:livreId" render={(props) => <Livre
                                basket={this.props.basket}
                                setBasket={this.props.setBasket}
                                lang={this.props.lang}
                                {...props}/>}/>
                            <Route path="/items/:itemId" render={(props) => <Item
                                basket={this.props.basket}
                                setBasket={this.props.setBasket}
                                lang={this.props.lang}
                                {...props}/>}/>

                            <Route path="/" render={props => <PopUp 
                                title={this.props.text.title}
                                lang={this.props.lang}
                                changeLang={this.props.changeLang}
                                {...props}/>}/>
                        </main>
                    </>
                </Router>
            </>)
    }
}
