const request = require('request');
const commandsUtils = require('./commands.utils');
var countries = require('country-list')();

class Paypal {
  static async createPayment(req, res)
  {
    const fee = 4.00
    const user = req.session.user_infos;
    let subtotal = 0;
    req.session.basket.items.forEach((item) => subtotal += item.price * item.amount);
    req.session.basket.typologies.forEach((item) => subtotal += item.price * item.amount);
    const items = [];
    const total = subtotal + fee;
    await commandsUtils.addCommand(user, req.session.basket, 1, total);
    req.session.basket.items.forEach((item) => items.push({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.amount,
        currency: 'EUR'
    }));

    req.session.basket.typologies.forEach((item) =>items.push({
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.amount,
        currency: 'EUR'
    }));

    // 2. Call /v1/payments/payment to set up the payment
    await request.post(process.env.PAYPAL_API + '/v1/payments/payment',
    {
      auth: {
        user: process.env.PAYPALID,
        pass: process.env.PAYPALSECRET
      },
      body: {
        intent: 'sale',
        payer:
        {
          payment_method: 'paypal',
        },
        transactions: [{
          amount: {
            total: total,
            currency: 'EUR',
            details: {
              subtotal: subtotal,
              tax: '0.00',
              shipping: fee,

            }
          },
          description: 'Les typologies',
          item_list: {
            items: items,
            shipping_address: {
              recipient_name: user.firstname + ' ' + user.lastname,
              line1: user.address1,
              line2: user.address2,
              city: user.city,
              country_code: countries.getCode(user.country),
              postal_code: user.postal_code,
              phone: user.tel,
            },
          }
        }],
      note_to_payer: 'Contact us for any questions on your order.',
        redirect_urls: {
          return_url: 'https://localhost:3001/success',
          cancel_url: 'https://localhost:3000/cancelled'
        }
      },
      json: true
    }, function(err, response)
    {
    if (err)
      {
        console.error(err);
        return res.sendStatus(500);
      }
      // 3. Return the payment ID to the client
      res.json(
      {
        id: response.body.id
      });
    });
  }

  static async executePayment(req, res)
  {
    const fee = 4.00
    let subtotal = 0;
    req.session.basket.items.forEach((item) => subtotal += item.price * item.amount);
    req.session.basket.typologies.forEach((item) => subtotal += item.price * item.amount);
    const total = subtotal + fee;
    // 2. Get the payment ID and the payer ID from the request body.
    var paymentID = req.body.paymentID;
    var payerID = req.body.payerID;
    // 3. Call /v1/payments/payment/PAY-XXX/execute to finalize the payment.
    await request.post(process.env.PAYPAL_API + '/v1/payments/payment/' + paymentID +
      '/execute',
      {
        auth:
        {
          user: process.env.PAYPALID,
          pass: process.env.PAYPALSECRET
        },
        body:
        {
          payer_id: payerID,
          transactions: [
          {
            amount:
            {
              total: total,
              currency: 'EUR'
            }
          }]
        },
        json: true
      },
      function(err, response)
      {
        if (err)
        {
          console.error(err);
          return res.sendStatus(500);
        }
        // 4. Return a success response to the client
        res.json(
        {
          status: 'success'
        });
      });
  }
}

module.exports = Paypal