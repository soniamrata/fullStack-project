const jwt = require("jsonwebtoken")
const blogModel = require("../models/blogModel.js")
const userModel=require('../models/userModel.js')
const AuthorModel = require("../models/authorModel.js")
const { isValidObjectId } = require("mongoose")

const authentication = function (req, res, next) {

    try {

    let token = req.headers["x-api-key"]

    if (!token) return res.status(400).send({ status: false, msg: "token must be present" })

    jwt.verify(token, "my-secret-key", function (err, decodedToken) {
        if (err) return res.status(401).send({ status: false, msg: "token is invalid" })
        console.log(decodedToken)
        req.loggedInUser = decodedToken.authorId
        console.log(req.loggedInUser)
        next()
    });

} catch (error){
    res.status(500).send({ status: false, msg: error.message })
}
}

const authorization = async function(req , res , next){

    try{

    let blogId = req.params.blogId
    let authorId = req.body.authorId

    if(authorId){
        let isValidAuthorId = isValidObjectId(authorId)

        if(!isValidAuthorId) return res.status(400).send({status: false , msg: "AuthorId is not a valid ObjectId."})
    }

    if(blogId){
        let isValidBlogId = isValidObjectId(blogId)

        if(!isValidBlogId) return res.status(400).send({status: false , msg: "BlogId is not a valid ObjectId."})

        let user = await blogModel.findById(blogId)

        if(!user){return res.status(400).send({status: false, msg: "Blog is not available !"})}

        authorId = user.authorId.toString()
    }

    if( authorId !== req.loggedInUser ){
        return res.status(403).send({status: false, msg: "Not Authorized !!!"})
    } 
    next()

}catch(error){
    res.status(500).send({ status: false, msg:error.message})
}
}

module.exports = {authentication , authorization}