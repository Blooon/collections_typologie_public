import React, { Component } from 'react';
import requestUtils from './Utils/request.utils';
import Navbar from './Navbar/Navbar.react';
import Footer from './Navbar/Footer.react';
import { BrowserRouter as Router, Route } from "react-router-dom";

function createCookie(name,value,days) {
  var expires = ""
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		expires = "; expires="+date.toGMTString();
	}
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)===' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

// function eraseCookie(name) {
// 	createCookie(name,"",-1);
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      connected: false,
      basket: {
        items: [],
        typologies: [],
      },
      lang: '_fr',
      texts: {
        footer: {
          fr: {},
          en: {}
        },
        navbar: {
          fr: {},
          en: {}
        }
      },
      printCookies: false,
    }
    this.setUser = this.setUser.bind(this);
    this.changeLang = this.changeLang.bind(this);
    this.setBasket = this.setBasket.bind(this);
    this.logout = this.logout.bind(this);
    this.loadBasket = this.loadBasket.bind(this);
    this.loadBasket();
    this.loadText = this.loadText.bind(this);
    this.loadText('footer');
    this.loadText = this.loadText.bind(this);
    this.loadText('navbar')
  }

  async loadText(onceName) {
    try {
      const body = await requestUtils.get('/once/' + onceName);
      const texts = this.state.texts; 
      texts[onceName] = body.data;
      this.setState({
          texts
      });
    }
    catch (err) {
        console.log(err);
    }
}

  async loadBasket() {
      try {
        const body = await requestUtils.get('/shop');
        this.setState({
            basket: body.basket
        });
      }
      catch (err) {
          console.log(err);
      }
  }

  setUser(user) {
    this.setState({ user, connected: true });
  }

  changeLang() {
    this.setState({ lang: (this.state.lang === '_fr') ? '_en' :'_fr' });
  }

  setBasket(basket) {
    this.setState({basket})
  }

  logout() {
    this.setState({ user: {}, connected: false })
  }

  render() {
    let cookiesAlert = null;
    if (readCookie('printCookie') !== 'false') {
      cookiesAlert = <>
        <div className="cookies-alert w3-white w3-bottom">
          <h1 className="helvetica">Cookies</h1>
          <p className="noto">{(this.state.lang === '_fr') ? "En poursuivant votre navigation sur notre site, vous acceptez l’utilisation de cookies pour sauvegarder votre panier après déconnexion et mesurer l'audience de notre site." : "By navigating the site, you agree to collection of information on and off our site through cookies to save your cart once disconnected and analyse our traffic."}</p>
          <p className="noto"><a href="legal#Cookies">{(this.state.lang === '_fr') ? "En savoir plus" : "Learn more"}</a></p>
          <button onClick={() => {createCookie('printCookie', 'false', 360); this.setState({printCookies: false})}} className="cookies-button w3-display-topright w3-bar-item w3-display-container">
              <img src={process.env.REACT_APP_S3_BUCKET_BASE_URL + "pictos/TYPOLOGIE_CROIX_RESPONSIVE_28x28px.svg"} alt="Close"/>
          </button>
        </div>
      </>
    }

    return (
      <>
        <Router>
          <>
          <div className="noto w3-center">{this.state.error}</div>
          <Route path="/" render={() => <Navbar
              user={this.state.user}
              connected={this.state.connected}
              basket={this.state.basket}
              setBasket={this.setBasket}
              setUser={this.setUser}
              changeLang={this.changeLang}
              logout={this.logout}
              text={(this.state.lang === '_en') ? this.state.texts.navbar.en: this.state.texts.navbar.fr}
              textFooter={(this.state.lang === '_en') ? this.state.texts.footer.en: this.state.texts.footer.fr}
              lang={this.state.lang}
          />
          }
          />
          {cookiesAlert}
            <Footer 
              text={(this.state.lang === '_en') ? this.state.texts.footer.en: this.state.texts.footer.fr}
              lang={this.state.lang}
              />
          </>
        </Router>
      </>
    );
  }
}

export default App;
