const Razorpay=require('razorpay')
const Order=require('../model/order')
const User=require('../model/exp')
const Exp=require('../model/user')
const sequelize = require('../util/database')

exports.purchasepremium=async(req,res)=>{
    //console.log(req.user)
    try{
        
        var rzp=new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
            
           // key_id: '',
           // key_secret: ''
       })
       //console.log(1)
       const amount=2;

       const options={
        amount:amount*100,
        currency:'INR'
       }
       //console.log(2)
       //console.log(rzp.orders)
       rzp.orders.create(options,async(err,order)=>{
        if(err){
            //console.log(3)
            throw new Error(JSON.stringify(err))
            
        }
        try{
            //console.log(4)
            await Order.create({orderid:order.id,status:'PENDING'});
            return res.status(201).json({order,key_id:rzp.key_id});
        }

        catch(err){
            throw new Error(err);
        }
           
        })      
       
    }
    catch(err){
        //console.log(process.env.RAZORPAY_KEY_SECRET)
        console.log(err);
        Order.create({orderid:req.body.order_id,status:'FAILED'})
        res.status(403).json({message:'Something went wrong',error:err})
    }
}

exports.updatetransactionstatus=async (req,res)=>{
    try{
        const t=await sequelize.transaction();
        const { payment_id, order_id}=req.body;
        Order.findOne({where:{orderid:order_id}})
        .then(order=>{
            order.update({paymentid:payment_id,status:'SUCCESSFUL'},{transaction:t})
            .then(async ()=>{
                //await t.commit()
                req.user.update({ispremiumuser:true},{transaction:t})
                .then(async ()=>{
                    await t.commit()
                    return res.status(202).json({success:true,message:"Transaction Successfull"});
                }).catch(async (err)=>{
                    //t.rollback()
                    throw new Error(err);
                    
                })
            }).catch(async (err)=>{
                
                //t.rollback()
                throw new Error(err)
                
            })
        }).catch(async (err)=>{
           // t.rollback()
                        throw new Error(err)
            
        })
    }
    catch(err){
        t.rollback()
        console.log(err)
    }
}
exports.leaderboard=async (req,res)=>{
    try{

        
        /*//////////////////TABLE JOIN////////////////////////////////////////////////////////
        //optimize-take only needed attributes and join tables through userid and order in DESC order
        let result=await User.findAll({attributes:['id','name',[sequelize.fn('sum', sequelize.col('expenses.amt')), 'totexp']],
        include:[
            {
                model: Exp,
                attributes:[]
            }

        ],
        group:['users.id'],
        order:[['totexp','DESC']]
        })
        */
    /*
        let result1 = await Exp.findAll({
            attributes: [
              'userId',
              [sequelize.fn('sum', sequelize.col('expenses.amt')), 'totexp']
            ],
            group: ['userId']
          });
        
        var lb=[];

        for(let i=0;i<result.length;i++){
            var uid=result[i].dataValues.id;
            var name=result[i].dataValues.name;
            var result1=await Exp.findAll({where:{userId:uid},attributes:['amt']})
            //console.log(result1)
            var totexp=0;
            for(let j=0;j<result1.length;j++){
                totexp+=result1[j].dataValues.amt;
            }

           var obj={
            "name":name,
            "totexp":totexp
           }

           lb.push(obj);
        }
        /////////////////////////////////////////////////////////////////
        //console.log(lb)
       
        var userLeaderBoardDEtails=[];
        result.forEach((user)=>{
            //console.log(user.name)
            userLeaderBoardDEtails.push({name:user.name,totexp:result1[user.id] || 0})
        })
        //to sort in descending order
        //userLeaderBoardDEtails.sort((a, b) => b.totexp - a.totexp);

        console.log(result1)
        */

        //////////////////totExp column introduced

        let result=await User.findAll({attributes:['id','name','totExp'],
        order:[['totExp','DESC']]
        })
        //console.log(result)
        res.status(200).json(result);
    }
    catch(err){
        console.log(err);
    }
}

