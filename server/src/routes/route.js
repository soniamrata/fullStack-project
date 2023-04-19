const express = require('express')
const router = express.Router()
const { createUser, loginUser } = require("../controller/userController")


//---------------------- user's's APIs ----------------------//

//===================== User Registration (Post API) =====================//
router.post("/register", createUser)
//===================== User Login (Post API) =====================//
router.post("/login", loginUser)



//---------------------- It will Handle error When You input Wrong Route =====================>>>//
router.all("/**", (req, res) => { return res.status(404).send({ status: false, msg: "This API request is not available!" }) })
//<<<------------------------------------------------------------------->>>//



//----------------------Module Export----------------------//
module.exports = router;
//<<<------------------------------------------------------------------->>>//