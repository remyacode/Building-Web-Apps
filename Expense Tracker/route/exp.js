const express = require("express");
const router=express.Router()
const expController=require('../controller/exp');
const userController=require('../controller/user')
const userauthenticate=require('../middleware/auth')

const exp = require("constants");

router.post('/signup',expController.OnSignUp)
router.post('/user/login',expController.OnLogin)

router.get('/user/frontpage',userauthenticate.authenticate,userController.frontpage)
router.post('/user/add-to-expense',userauthenticate.authenticate,userController.addtoexpense)
router.put('/user/editExp/:Nid',userController.editExp)
router.delete('/user/deleteExp/:Nid',userController.deleteExp)

module.exports=router