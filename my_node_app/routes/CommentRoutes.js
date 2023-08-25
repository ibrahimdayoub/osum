import { Router } from "express"
const router = Router()

import { addComment, getComment, updateComment, deleteComment, getComments, likeComment } from '../controllers/CommentController.js'
import { protectAdminAndOwner, protectAllWithoutAdmin } from "../middlewares/ProtectMiddleware.js"

//router.post('/add',protectAllWithoutAdmin,addComment) with file in app.js
router.get('/get/:id', protectAdminAndOwner, getComment)
//router.put('/update/:id',protectAdminAndOwner,updateComment) with file in app.js
router.delete('/delete/:id', protectAdminAndOwner, deleteComment)
router.post('/get', protectAllWithoutAdmin, getComments)
router.put('/like/:id', protectAllWithoutAdmin, likeComment)
export default router