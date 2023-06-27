const express=require('express');
const app=express();

const bodyParser=require('body-parser')
var cors=require('cors');
const expRoute=require('./route/exp');
const sequelize=require('./util/database');

const User=require('./model/exp')
const Exp=require('./model/user')

app.use(bodyParser.json());     //why .json() ?!
app.use(cors());
app.use(expRoute);

//this puts userId as foreign key in expenses table automatically!
User.hasMany(Exp);
Exp.belongsTo(User);

sequelize.sync()
.then(()=>{
    console.log('go ahead!');
    app.listen(3007);
})
