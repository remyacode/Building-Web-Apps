const express=require('express');
require('dotenv').config()
const app=express();
const helmet=require('helmet')
var compression=require('compression')
const morgan=require('morgan')
const fs=require('fs')

const bodyParser=require('body-parser')
var cors=require('cors');
const expRoute=require('./route/exp');
const sequelize=require('./util/database');
const purchRoute=require('./route/purchase')

const User=require('./model/exp')
const Exp=require('./model/user');
const Order = require('./model/order');
const Fp = require('./model/fp');
const path=require('path')

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'})

const port=process.env.PORT||3000;

app.get('/',(req,res)=>{

    res.json({port})
})

app.use(bodyParser.json());     //why .json() ?!
app.use(cors());
app.use(purchRoute);
app.use(expRoute);

app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream:accessLogStream}))
//this puts userId as foreign key in expenses table automatically!
User.hasMany(Exp);
Exp.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Fp);
Fp.belongsTo(User);

console.log(port)
sequelize.sync()
.then(()=>{
    console.log('go ahead!');
    app.listen(port);
})
