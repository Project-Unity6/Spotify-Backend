const express = require("express")
const router = express.Router();
const authController = require("../controllers/auth.controller")

/* /api/auth/register */
router.post("/register",authController.userRegister)

/* /api/auth/login */
router.post("/login",authController.loginUser)

router.post("/logout",authController.logoutUser)
module.exports = router