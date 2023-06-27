const express = require("express");
const router=express.Router()
const expController=require('../controller/exp');
const userController=require('../controller/user')

const exp = require("constants");

router.post('/signup',expController.OnSignUp)
router.post('/user/login',expController.OnLogin)

router.get('/user/frontpage',userController.frontpage)
router.post('/user/add-to-expense',userController.addtoexpense)
router.put('/user/editExp/:Nid',userController.editExp)
router.delete('/user/deleteExp/:Nid',userController.deleteExp)

module.exports=router