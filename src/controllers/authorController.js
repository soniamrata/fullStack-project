
//=====================Importing Module and Packages=====================//
const authorModel = require("../models/authorModel.js")
const JWT = require('jsonwebtoken')


//=====================This function is used for Creating an user=====================//
const authors = async function (req, res) {

    try {
    
        const data = req.body
        const {fname , lname , title , email , password} = req.body
    
        if(!fname) return res.status(400).send({ status: false, message: "Firstname is required." })
        if(!lname) return res.status(400).send({ status: false, message: "Lastname is required." })
        if(!title) return res.status(400).send({ status: false, message: "Title is required." })
        if(!email) return res.status(400).send({ status: false, message: "Email is required." })
        if(!password) return res.status(400).send({ status: false, message: "Password is required." })
    
        const validName = (/^[a-zA-Z .]{3,20}$/)
        const isValidPassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{5,12}$/)
    
        if (!validName.test(fname)) return res.status(400).send({ status: false, message: "Invalid firstname." })
    
        if (!validName.test(lname)) return res.status(400).send({ status: false, message: "Invalid lastname." })
    
        if (!(["Mr", "Mrs", "Miss"].includes(title))) return res.status(400).send({status: false, msg: "You can use only Mr, Mrs & Miss in title."})
    
    
        if (!isValidPassword.test(password)) return res.status(400).send({ status: false, message: "Please use a strong password including special characters." })
    
        let isEmailInUse = await authorModel.findOne({email})
    
        if(isEmailInUse) return res.status(400).send({ status: false, message: "Email Id already in use." })
    
        const result = await authorModel.create(data)
        res.status(201).send({ status : true , data : result })
    
    } catch (err) {
        res.status(500).send({ status : false , msg : err.message })
    }
    }
    
    const authorLogin = async function(req,res){
    
    try{
    
        let userId = req.body.email
        let password = req.body.password
    
        if(!userId || !password) return res.status(400).send({status : false , msg : "Please enter your UserId and Password !!!"})
    
    
        let user = await authorModel.findOne({ email : userId , password : password })
    
        if(!user) return res.status(404).send({status : false , msg : "UserId or Password is incorrect !!!"})
    
        let token = jwt.sign({authorId : user._id.toString()} , "my-secret-key")
    
        res.setHeader("x-api-key" , token)
        res.status(200).send({ status : true , data : token })
    
    } catch(error){
        res.status(500).send({status : false , msg : error.message})
    }
    }
    
    module.exports = { authorLogin , authors }
