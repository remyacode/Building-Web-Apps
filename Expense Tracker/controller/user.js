const User=require('../model/user')
const Exp=require('../model/exp')
const sequelize=require('../util/database')


exports.addtoexpense=async (req,res,next)=>{
    const t=await sequelize.transaction();
    //const userId=req.params.userId;
    //console.log(req.user.id)
    const amt=req.body.amt;
    const des=req.body.des;
    const cat=req.body.cat;

    
    await User.create({
        amt:amt,
        des:des,
        cat:cat,
        userId:req.user.id
    },
    {transaction:t})
    .then(async (result)=>{
        let totamt;
        const totamtatt=await Exp.findOne(
            {attributes:['id','totExp'],where:{id: result.dataValues.userId}})
        //console.log('totamtttt.totexp==========',totamtatt.totExp,'---------id======',totamtatt.id,'-------resduid-----',result.dataValues.userId)
        if(totamtatt.totExp==0){
            totamt=parseInt(amt);
            //console.log('null------------',totamt)
        }
        else{ totamt =parseInt(totamtatt.totExp,10)+parseInt(amt,10);
        //console.log('notnull-------------',totamt)
        }
    
    //    totamt =parseInt(totamtatt.totExp,10)+parseInt(amt,10)
        await Exp.update({totExp:totamt},{where:{id:result.dataValues.userId},transaction:t})
        await t.commit()
        let rest=await Exp.findOne({where:{id:result.dataValues.userId}})
            //console.log('rest==============',rest.dataValues)
            //console.log('result------------',result.dataValues)
        res.status(200).json((result))
            
    })
    .catch(async (err)=>{
       await t.rollback()
        console.log(err)})
}

exports.frontpage=async(req,res,next)=>{
    //const userId=req.params.userId;
    //console.log(req.user.id)
    try{
        
        let rest=await Exp.findOne({where:{id:req.user.id}})
            console.log('rest//////////==============',rest.dataValues)
            
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

exports.deleteExp=async (req,res,next)=>{
    const t=await sequelize.transaction();
    const idd=req.params.Nid;

    //for Leaderboard//////////////////////
    const amt = await User.findOne({where:{id:idd}},{attributes:['amt','userId']})
    //console.log(amt.userId)
    var totamt=0;
    const totamtatt=await Exp.findOne({attributes:['totExp']},{where:{id:amt.userId}})
    if(totamtatt.totExp==null){
        totamt=parseInt(amt)
    }
    else{totamt =parseInt(totamtatt.totExp,10)-parseInt(amt.amt,10)}
    const sample=await Exp.update({totExp:totamt},{where:{id:amt.userId},transaction:t})
    //await t.commit()
    //console.log(sample)
    /////////////////////////

    await User.destroy({where:{id:idd},transaction:t})
    .then(async (result)=>{
        await t.commit()
        res.status(200).send('deleted')})
    .catch(async (err)=>{
        await t.rollback()
        console.log(err)})
}

exports.editExp=async(req,res,next)=>{
    const t=await sequelize.transaction();

    const id=req.params.Nid;
    const amt1=req.body.amt;
    const des1=req.body.des;
    const cat1=req.body.cat;
    let dataamt;
    await User.findByPk(id)
    .then((data)=>{
        dataamt=data.amt
        data.amt=amt1;
        data.des=des1;
        data.cat=cat1;
        return data.save({ transaction: t });
    })
    .then(async (result)=>{
        //await t.commit()
        console.log('result==============',result)
        var totamt=0;
        const totamtatt=await Exp.findOne({attributes:['totExp']},{where:{id:result.dataValues.userId}})
        totamt =parseInt(totamtatt.totExp,10)+parseInt(amt1,10)-parseInt(dataamt,10)
        const sample=await Exp.update({totExp:totamt},{where:{id:result.dataValues.userId},transaction:t})
        await t.commit()

        res.status(200).json((result));
    })
    .catch(async(err)=>{
        await t.rollback();
        console.log(err)})
}