const { isValidObjectId } = require("mongoose")
const AuthorModel = require("../models/authorModel.js")
const BlogsModel = require("../models/blogModel.js")

const createBlog = async function(req, res){

    try {

    let data = req.body
    let { title , body , tags , category , subcategory, authorId } = req.body

    if(!title) return res.status(400).send({status: false , msg: "title is required."})
    if(!body) return res.status(400).send({status: false , msg: "body is required."})
    if(!category) return res.status(400).send({status: false , msg: "category is required."})
    if(!authorId) return res.status(400).send({status: false , msg: "AuthorId is required."})

    let isValidAuthorId = isValidObjectId(authorId)

    if(!isValidAuthorId) return res.status(400).send({status: false , msg: "AuthorId is not a valid ObjectId."})

    let AuthorIdCheck = await AuthorModel.findById(authorId)

    if(!AuthorIdCheck) return res.status(404).send({status: false , msg: "AuthorId is not available."})

    let createdBlog = await BlogsModel.create(data)

    res.status(201).send({ status : true , data : createdBlog })

} catch (err) {
    res.status(500).send({ status : false , msg : err.message })
}
}

const getBlogs = async function(req,res) {

    try{

    let filters=req.query

    let{authorId}=filters

    if(authorId){
        let isValidAuthorId = isValidObjectId(authorId)
        if(!isValidAuthorId) return res.status(400).send({status: false , msg: "AuthorId is not a valid ObjectId."})
    }

    filters.isDeleted = false
    filters.isPublished = true

    let data = await BlogsModel.find(filters)
    if(data.length==0) return res.status(404).send({status: false , msg: "Blog is not available."})

    res.status(200).send({status: true , Data: data})

} catch (err) {
    res.status(500).send({ status : false , msg : err.message })
}
}

const updateBlogs = async function(req,res){

    try {

    let blogId = req.params.blogId
    let { title , body , tags , category , subcategory } = req.body

    if(!blogId) return res.send.status(400).send({ status : false , msg : "BlogId is required." })

    let isValidBlogId = isValidObjectId(blogId)

    if(!isValidBlogId) return res.status(400).send({status: false , msg: "BlogId is not a valid ObjectId."})

    let isavailable = await BlogsModel.findOne({_id : blogId , isDeleted : false})

    if(!isavailable) return res.status(404).send({ status : false , msg : "Blog is not available." })

    let updatedData = await BlogsModel.findOneAndUpdate({ _id : blogId } , { $set:  { publishedAt : new Date() } , isPublished : true , title : title ,  body : body  , category : category ,  $push: { tags : tags , subcategory : subcategory}   } , { new : true })

    res.status(200).send({ status : true , data : updatedData })

}   catch (err) {
    res.status(500).send({ status : false , msg : err.message })
}
}

const deleteBlog = async function(req,res){

    try {

    let blogId = req.params.blogId

    if(!blogId) return res.status(400).send({ status : false , msg : "BlogId is required." })

    let isValidBlogId = isValidObjectId(blogId)

    if(!isValidBlogId) return res.status(400).send({status: false , msg: "BlogId is not a valid ObjectId."})

    let isAvailable = await BlogsModel.findById(blogId)

    if(!isAvailable) return res.status(404).send({ status : false , msg : "Blog is not available." })

    if(isAvailable.isDeleted === true) return res.status(200).send({ status : true , msg : "Blog is already deleted." })

    let deletedBlog = await BlogsModel.findOneAndUpdate({ _id : blogId , isDeleted : false } , { $set : {isDeleted : true , deletedAt : new Date() , isPublished : false}} , { new : true } )

    res.status(200).send({ status : true , data : deletedBlog })

} catch (err) {
    res.status(500).send({ status : false , msg : err.message })
}
}

const deBlogsQ = async function (req, res) {

    try {

    let filters = req.query

    if((Object.keys(filters)).length == 0) return res.status(400).send({ status : false , msg : "filters are required." })

    let { authorId } = filters

    if(authorId) {
        let isValidAuthorId = isValidObjectId(authorId)

        if(!isValidAuthorId) return res.status(400).send({status: false , msg: "AuthorId is not a valid ObjectId."})

        if(authorId !== req.loggedInUser) return res.status(403).send({status: false, msg: "Not Authorized !!!"})
    }

    if(!authorId) filters.authorId=req.loggedInUser

    let ub = await BlogsModel.updateMany(filters,{ isDeleted: true , deletedAt: new Date() , isPublished : false })

    if (!ub) return res.status(404).send({ status: false, msg: "Blog is not available." })

    res.status(200).send({ status : true , msg : "Blog Deleted." })

} catch (err){ 
    res.status(500).send({ status : false , msg : err.message })
}
}

module.exports = { createBlog,getBlogs,updateBlogs,deleteBlog,deBlogsQ } 