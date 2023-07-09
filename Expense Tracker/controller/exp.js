const Exp=require('../model/exp')
const path=require('path')
//for password encryption
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

exports.OnSignUp=async (req,res,next)=>{
    try{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    //randomize the saltrounds 10 times
    bcrypt.hash(password,10,async (err,hash)=>{
        console.log(err)
        await Exp.create({
            name:name,
            email:email,
            password:hash
        })
      //  .then(result=>{
            res.status(201).json({message:'Successfully created new user'})
      //  })
    })
    }

    catch(err){

        console.log(err)
        //impotant for displaying error on webpage
        res.status(500).json({ error: 'An error occurred.' })
    }
    
}

function generateAccessToken(id){
    return jwt.sign({userId:id},'randomkey')
}

exports.OnLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    Exp.findOne({where:{email:email}})
    .then(edata=>{
        if(!edata){
            res.status(404).send('User not found!')
        }
        else{

            bcrypt.compare(password,edata.password,(errp,resp)=>{
                //console.log(res)
                if(resp===true){
                    //res.status(200).send('User logged in successfully!')
                    res.status(200).json({success:true, message:'User logged in successfully!',token:generateAccessToken(edata.id),user:edata})
                }
                else{
                    console.log(errp);
                    res.status(401).send('User not authorized!')
                }
            })

            /*
            Exp.findOne({where:{password:password}})
                .then(pdata=>{
                    //console.log(edata.password)
                    //console.log(pdata)
                    if(pdata==null || edata.password!==pdata.password){
                        res.status(401).send('User not authorized!')
                    }
                    else{
                        res.status(200).json((edata))
                    }
                })
                .catch(err1=>console.log(err1))
                */
        }
        
    })
    .catch(err=>console.log(err))
}


const sib=require('sib-api-v3-sdk')
require('dotenv').config()

exports.passreset=(req,res,next)=>{
    //console.log('the email to be used is====',req.body.nemail);

    const client=sib.ApiClient.instance


    const apiKey=client.authentications['api-key']
    apiKey.apiKey=process.env.API_KEY

    const tranEmailApi= new sib.TransactionalEmailsApi()

    const sender={
        email:'remyacnair710@gmail.com',
        name: 'Expense Tracker Admin'
    }

    const receiver=[
        {
            email: req.body.nemail,
        },
    ]

    tranEmailApi.sendTransacEmail({
        sender,
        to:receiver,
        subject: 'Reset Password for Expense Tracker',
        textContent:`This mail is to reset password for expense tracker!`
        //htmlContent:

    }).then(res.status(201).json({message:'Successfully reset password'}))
    .catch(err=>console.log(err))
}