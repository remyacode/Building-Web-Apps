const jwt=require('jsonwebtoken')
const User=require('../model/exp')

const authenticate=(req,res,next)=>{
    try{
        const token=req.header('Authorization');
        //console.log(token);
        const user=jwt.verify(token,'randomkey');
        //console.log(user.userId)
        User.findByPk(user.userId).then(user=>{
            //console.log(JSON.stringify(user));
            req.user=user; //next is the next fn after this middleware,we found the user and pass it as req to next middleware
            next();
        })

    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}

module.exports={authenticate}