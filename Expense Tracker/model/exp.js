const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const Exp=sequelize.define(('users'),{
id:{
    type:Sequelize.INTEGER,
    allowNull:false,
    unique:true,
    autoIncrement:true,
    primaryKey:true
},
name:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:false

},
email:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:true

},
password:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:false
},
ispremiumuser: Sequelize.BOOLEAN
})
module.exports=Exp