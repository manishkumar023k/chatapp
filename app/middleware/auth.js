const jwt=require('jsonwebtoken');
const {User}=require('../models/user');
const auth= async (req,res,next)=>{
   try {
    const authenticationToken =req.header('Authorization').replace('Bearer ','');
    const decode= await jwt.verify(authenticationToken, "mynameismanishkumar");
    const user=await User.findOne({_id:decode._id,'tokens.token':authenticationToken});
    // console.log(authenticationToken)
    if(!user)
    {
        throw new Error();
    }

    req.token=authenticationToken;
    req.user=user;
    next();
       

   } catch (error) {
       console.log(error)
       res.status(401).send({error:'Enable to connect..'});
   }

}
module.exports=auth;