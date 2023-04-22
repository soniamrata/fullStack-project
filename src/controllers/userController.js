//=====================Importing Module and Packages=====================//
const userModel=require('../models/userModel.js')
const JWT = require('jsonwebtoken')


//=====================This function is used for Creating an user=====================//
const createUser=async function(req,res){
    try{ 
    const data=req.body
    const {email,password}=data
    if(Object.keys(data)==0) return res.status(400).send({status:false, message:"No data given for creation"})

    if(!email) return res.status(400).send({status:false, message:"email is mandatory"})
   if(!password) return res.status(400).send({status:false, message:"password is mandatory"})
   
    const userCreated=await userModel.create(data)
    return res.status(201).send({status:true, message:"Success", data:userCreated})
}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}

//============================login user===========================//


const loginUser = async function (req, res) {
    try {
        let email =req.body.userName;
        let password =req.body.password
    
        //=====================Checking Mandotory Field=====================//
        if (!(email && password)) { return res.status(400).send("All Fields are Mandotory.") }


        let userData = await userModel.findOne({email: email, password: password })
        if (!userData) { return res.status(400).send({ status: false, message: "invalid credentials! pls check it " }) }

        let payload =
        {
            userId: userData['_id'].toString()  
            

        }
        let token = JWT.sign({ payload }, "DBMCompany",{expiresIn :'24h'})  //expires in 24 hrs
        res.setHeader("x-api-key", token)
        
       
       res.status(200).send({ status: true, message: "token generated successfully", token:token})
    }
        
catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }

    
}
module.exports ={loginUser,createUser}