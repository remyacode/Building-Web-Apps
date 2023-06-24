const Exp=require('../model/exp')
const path=require('path')

exports.OnSignUp=async (req,res,next)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    Exp.create({
        name:name,
        email:email,
        password:password
    })
    .then(result=>{
        res.status(200).json((result))
    })
    
    .catch(err=>{

        console.log(err)
        //impotant for displaying error on webpage
        res.status(500).json({ error: 'An error occurred.' })
    }
    )
}