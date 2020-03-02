const stripe = require("stripe")(process.env.STRIPE_SECRET);
const shopModel = require('../data/shop.models');
const commandsUtils = require('./commands.utils');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.GMAILUSER,
         pass: process.env.GMAILPASSWORD
     }
 });


async function stockValidItem(table, items) {
  for(let i = 0; i < items.length; i++) {
    const item = items[i];
    await shopModel.verifStockItem(table, item.id, item.amount);
  }
}

async function stockValidTypologie(table, items) {
  for(let i = 0; i < items.length; i++) {
    const item = items[i];
    await shopModel.verifStockTypologie(table, item.id, item.amount);
  }
}

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

function sendNotifMail() {
  const mailOptions = {
    from: 'notif@collectionstypologie.com', // sender address
    to: 'contact@collectionstypologie.com', // list of receivers
    subject: 'New command on typologie', // Subject line
    html: '<p>You should check out !</p>'// plain text body
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) console.log(err);
    console.log(info);
  })
}

class StripePaiement {
  static async handlePaiement(req, res) {
    const basket = req.session.basket
    let items = [];
    basket.items.forEach((item) => items.push({
        name: item.name,
        price: item.price,
        description: item.description,
        quantity: item.amount,
        fee_france: item.fee_france,
        fee_europe: item.fee_europe,
        fee_world: item.fee_world,
        currency: 'EUR'
    }));

    basket.typologies.forEach((item) =>items.push({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.amount,
        fee_france: item.fee_france,
        fee_europe: item.fee_europe,
        fee_world: item.fee_world,
        currency: 'EUR'
    }));
    
    const fee = req.body.user_livraison!==null ? calcul_fees(items, req.body.user_livraison.country) : calcul_fees(items, req.body.user.country)
    
    let subtotal = 0;
    req.session.basket.items.forEach((item) => subtotal += item.price * item.amount);
    req.session.basket.typologies.forEach((item) => subtotal += item.price * item.amount);
    const total = subtotal + fee;
    await stockValidTypologie('typologie', req.session.basket.typologies);
    await stockValidItem('item', req.session.basket.items);
    console.log(req.body.token);
    const charge = stripe.charges.create({
      amount: total * 100,
      currency: 'eur',
      source: req.body.token,
      receipt_email: req.body.user.email,
      description: 'Commande typologie',
      metadata: { basket: req.body.basket }
    }).then(async (data) => {
      await commandsUtils.addCommand({user: req.body.user, user_livraison: req.body.user_livraison }, req.session.basket, data.id, data, subtotal, fee);
      req.session.basket = {
        items: [],
        typologies: []
    }
      await res.send({ message: "Success" });
      sendNotifMail();
    })
    .catch(async (err) => {
      console.log(err);
      await res.status(500).send({ message: { en: "Error while processing your order", fr: "Une erreur est apparue pendant votre commande"}})
    })
  }
}

module.exports = StripePaiement;