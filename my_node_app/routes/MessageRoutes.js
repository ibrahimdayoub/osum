import { Router } from "express"
const router = Router()

import { getMessagesCounter, getChatMessages, addMessage } from '../controllers/MessageController.js'
import { protectAll } from "../middlewares/ProtectMiddleware.js"

router.get('/counter', protectAll, getMessagesCounter)
router.get('/get/:id', protectAll, getChatMessages)
// router.post('/add', protectAll, addMessage) with file in app.js

export default router