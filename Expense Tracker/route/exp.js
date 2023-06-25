const express = require("express");
const router=express.Router()
const expController=require('../controller/exp')

router.post('/signup',expController.OnSignUp)
router.post('/user/login',expController.OnLogin)

module.exports=router