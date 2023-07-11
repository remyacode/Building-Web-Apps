const express=require('express');
require('dotenv').config()
const app=express();


const bodyParser=require('body-parser')
var cors=require('cors');
const expRoute=require('./route/exp');
const sequelize=require('./util/database');
const purchRoute=require('./route/purchase')

const User=require('./model/exp')
const Exp=require('./model/user');
const Order = require('./model/order');
const Fp = require('./model/fp');

app.use(bodyParser.json());     //why .json() ?!
app.use(cors());
app.use(purchRoute);
app.use(expRoute);

//this puts userId as foreign key in expenses table automatically!
User.hasMany(Exp);
Exp.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Fp);
Fp.belongsTo(User);


sequelize.sync()
.then(()=>{
    console.log('go ahead!');
    app.listen(3007);
})
