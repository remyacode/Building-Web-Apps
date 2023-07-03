const Razorpay = require('razorpay');
const express = require('express');
require('dotenv').config()
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = 3000;

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SERVER_KEY
})

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {
  console.log('Server up!');
  res.send('Server is up and running!');
})

app.post('/create-order', async (req, res) => {
  let order;
  const orderOptions = req.body.orderOptions;
  try {
    order = await instance.orders.create({
      amount: orderOptions.amount,
      receipt: orderOptions.receipt,
      currency: "INR"
    })
  } catch (err) {
    order = null;
    res.status(502).json({
      success: false,
      err
    })
  }
  res.status(200).json(order);
})

// TODO:
// app.post('/verify-signature', (req, res) => {

// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})