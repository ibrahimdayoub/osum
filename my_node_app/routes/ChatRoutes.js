import { Router } from "express"
const router = Router()

import { accessChat, deleteChat, getChats, createGroup, updateGroup, leaveGroup, leaveChat } from '../controllers/ChatController.js'
import { protectAll, protectAdminAndOwner } from "../middlewares/ProtectMiddleware.js"

//For single (one to one) chats
router.post('/access-chat', protectAll, accessChat) //Create or get single chat (equales /add or /get)
router.put('/leave-chat/:id', protectAll, leaveChat)
//For both
router.delete('/delete/:id', protectAdminAndOwner, deleteChat) //Delete single or group chat by owner or admin
router.get('/get', protectAll, getChats) //Get single or group chats by its users

//For group (one to many) chats
//router.post('/create-group',protectAll,createGroup) with file in app.js
//router.put('/update-group/:id', protectAdminAndOwner, updateGroup) with file in app.js
router.put('/leave-group/:id', protectAll, leaveGroup)

export default router