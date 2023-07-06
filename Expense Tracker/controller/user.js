const User=require('../model/user')
const Exp=require('../model/exp')


exports.addtoexpense=(req,res,next)=>{
    //const userId=req.params.userId;
    //console.log(req.user.id)
    const amt=req.body.amt;
    const des=req.body.des;
    const cat=req.body.cat;
    
    User.create({
        amt:amt,
        des:des,
        cat:cat,
        userId:req.user.id
    })
    .then(result=>res.status(200).json((result)))
    .catch(err=>console.log(err))
}

exports.frontpage=async(req,res,next)=>{
    //const userId=req.params.userId;
    //console.log(req.user.id)
    try{
        let result=await User.findAll(
        {where: {userId: req.user.id}}
            );
            //console.log(result)
            let result1=await Exp.findAll(
               {where: {id: req.user.id}}
                   );
        const stat=result1[0].dataValues.ispremiumuser;
        res.status(200).json({result:result,stat:stat});
    }
    catch(err){
        console.log(err);
    }
}

exports.deleteExp=(req,res,next)=>{
    const idd=req.params.Nid;
    User.destroy({where:{id:idd}})
    .then(result=>res.status(200).send('deleted'))
    .catch(err=>console.log(err))
}

exports.editExp=async(req,res,next)=>{
    const id=req.params.Nid;
    const amt1=req.body.amt;
    const des1=req.body.des;
    const cat1=req.body.cat;

    await User.findByPk(id)
    .then((data)=>{
        data.amt=amt1;
        data.des=des1;
        data.cat=cat1;
        return data.save();
    })
    .then(result=>{
        res.status(200).json((result));
    })
    .catch(err=>console.log(err))
}