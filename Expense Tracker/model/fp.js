const Sequelize=require('sequelize')
const sequelize = require('../util/database')
const { DataTypes } = require('sequelize');

const { v4: uuidv4 } = require('uuid');


const Fp=sequelize.define('ForgotPasswordRequests',{
    id:{
        type: DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        primaryKey:true,
        allowNull:false
    },
    isactive:DataTypes.BOOLEAN
});

module.exports=Fp;