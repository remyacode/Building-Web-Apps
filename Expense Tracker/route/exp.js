const express = require("express");
const router=express.Router()
const expController=require('../controller/exp')

router.post('/signup',expController.OnSignUp)

module.exports=router