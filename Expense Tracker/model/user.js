const Sequelize=require('sequelize')
const sequelize=require('../util/database')
const User=sequelize.define(('expenses'),{
  id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique:true

    },
  amt:{
    type:Sequelize.INTEGER,
    allowNull:false,
    unique:false
  }  ,
  des:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:false
  }  ,
  cat:{
    type:Sequelize.STRING,
    allowNull:false,
    unique:false
  }  
});

module.exports=User