const Sequelize=require('sequelize')
const sequelize=new Sequelize('expense','root','your_new_password',{dialect:'mysql',host:'localhost'})
module.exports=sequelize
