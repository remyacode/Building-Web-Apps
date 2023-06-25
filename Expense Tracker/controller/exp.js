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

exports.OnLogin=(req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password;

    Exp.findOne({where:{email:email}})
    .then(edata=>{
        if(!edata){
            res.send('notexist')
        }
        else{
            Exp.findOne({where:{password:password}})
                .then(pdata=>{
                    //console.log(edata.password)
                    //console.log(pdata)
                    if(pdata==null || edata.password!==pdata.password){
                        res.send('mismatch')
                    }
                    else{
                        res.status(200).json((edata))
                    }
                })
                .catch(err1=>console.log(err1))
        }
        
    })
    .catch(err=>console.log(err))
}