import { Router } from "express"
const router = Router()

import { signUp, signIn, signOut, forgotPassword, resetPassword } from '../controllers/AuthController.js'
import { protectAll, protectAdmin } from "../middlewares/ProtectMiddleware.js"

//router.post('/sign-up',signUp) with file in app.js
router.post('/sign-in', signIn)
router.get('/sign-out', protectAll, signOut)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
export default router