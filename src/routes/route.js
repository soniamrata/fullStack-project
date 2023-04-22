const express = require('express')
const router = express.Router()
const BlogControllers = require("../controllers/blogController.js")
const authorController = require('../controllers/authorController.js')
const { createUser, loginUser } = require("../controllers/userController.js")
const{ authentication , authorization } = require("../middleware/middleware.js")



//---------------------- author's APIs ----------------------//


router.post("/register", authorController.authors)

router.post("/loginAuthor",authorController.authorLogin )


//---------------------- user's's APIs ----------------------//
router.post("/registerUser", createUser)
router.post("/userlogin", loginUser)
//-----------------------Blogs api's--------------------------------------------//

router.post("/blogs", authentication , authorization , BlogControllers.createBlog)

// API to find blogs

router.get("/blogs", authentication , BlogControllers.getBlogs)

// API to update blogs

router.put("/blogs/:blogId", authentication , authorization , BlogControllers.updateBlogs)

// API to delete blogs with path params

router.delete("/blogs/:blogId", authentication , authorization , BlogControllers.deleteBlog)

// API to delete blogs with query params

router.delete("/blogs", authentication , BlogControllers.deBlogsQ)


//---------------------- It will Handle error When You input Wrong Route =====================>>>//
router.all("/**", (req, res) => { return res.status(404).send({ status: false, msg: "This API request is not available!" }) })
//<<<------------------------------------------------------------------->>>//



//----------------------Module Export----------------------//
module.exports = router;
//<<<------------------------------------------------------------------->>>//