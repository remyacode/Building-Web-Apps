const express = require("express");
const router=express.Router()
const expController=require('../controller/exp');
const userController=require('../controller/user')

const exp = require("constants");

router.post('/signup',expController.OnSignUp)
router.post('/user/login',expController.OnLogin)

router.get('/:userId/frontpage',userController.frontpage)
router.post('/:userId/add-to-expense',userController.addtoexpense)
router.put('/:userId/editExp/:Nid',userController.editExp)
router.delete('/:userId/deleteExp/:Nid',userController.deleteExp)

module.exports=router