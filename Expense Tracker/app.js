const express=require('express');
const app=express();

const bodyParser=require('body-parser')
var cors=require('cors');
const expRoute=require('./route/exp');
const sequelize=require('./util/database');

app.use(bodyParser.json());     //why .json() ?!
app.use(cors());
app.use(expRoute);
sequelize.sync();
app.listen(3007);