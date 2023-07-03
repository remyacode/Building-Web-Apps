const express = require("express");
const router=express.Router()
const expController=require('../controller/exp');
const purchaseController=require('../controller/purchase')
const userauthenticate=require('../middleware/auth')

router.get('/purchase/premiummembership',userauthenticate.authenticate,purchaseController.purchasepremium)
//router.post('/updatetransactionstatus',userauthenticate.authenticate,purchaseController.updatetransactionstatus)
module.exports=router