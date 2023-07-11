const Exp=require('../model/exp')
const Fp = require('../model/fp');

//for password encryption
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const path=require('path')

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

const { v4: uuidv4 } = require('uuid');

exports.passreset=async (req,res,next)=>{
    //console.log('the email to be used is====',req.body.nemail);
    const uuid = uuidv4();
    //console.log('passreset uuid=========================',uuid)
    let result= await Exp.findOne({where:{email:req.body.nemail}});
    await Fp.create({id:uuid,isactive:true,userId:result.dataValues.id})
    //console.log('result----------fp----',result.dataValues.id)

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
        htmlContent:
        `${uuid}
        <form id="resetPasswordForm" action="file:///home/remya-c/Desktop/Sharpener%20Tasks/Web%20Apps/Expense%20Tracker/rpf.html" method="POST">
        <input type="hidden" name="uuid" value=\`${uuid}\`>
          <button type="submit">Click to reset Password</button>
        </form>`
        /*
        `<html>
        <body>
        <p>This mail is to reset password for the Expense Tracker!</p>
        <a href=\`http://localhost:3007/password/resetpasswordform/${uuid}\` method='POST'>Click here to reset your password</a>

                    </body>
                    </html>
        `
        */
        //`<a href="/rpl.html?uuid=${uuid}">Link to reset Password!</a>`
        //<button id="prle" class="btn prle" onclick="showResetPasswordForm('${uuid}')">Reset password link!</button>


    }).then(res.status(201).json({message:'Successfully sent mail!'}))
    .catch(err=>console.log(err))
}

exports.resetlinksubmit=async (req,res,next)=>{
    const uuid = req.body.uuid;
    //console.log('requestttt',req.body)
    const newpassword=req.body.pass;
    //console.log(uuid)
    let result= await Fp.findOne({where:{isactive:true}});
    //console.log('result isssssssssssssssssss',result)
    const userid=result.dataValues.userId;
    console.log(userid)

    bcrypt.hash(newpassword,10,async (err,hash)=>{
        console.log(err)
     //   await Exp.update({
    //     password:hash},{where:{id:userid},transaction:t})
        await Exp.findByPk(userid)
            .then((data)=>{
                //console.log(data.email,'dataemaillllllllllll')
                data.password=hash;
             return data.save();
             })
        //  })
       //     })
      .then(async (data)=>{
        //await t.commit();
        //console.log(newpassword,'hashhhhhhhhhhh',data)
        const sample=await Fp.update({isactive:false},{where:{isactive:true}})
        //console.log(sample)
        res.status(201).json({message:'Successfully updated password',success:true})
      }).catch(async (err)=>{
        console.log(err)
        //await t.rollback()
      })
    })


}
/*

exports.resetform=(req,res,next)=>{
    const uuid=req.params.uuid;
    res.sendFile(path.join(__dirname,'../rpf.html'),{ uuid })
}

*/