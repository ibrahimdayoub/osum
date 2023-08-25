import { Router } from "express"
const router = Router()

import { addStory, getStory, deleteStory, getStories, likeStory } from '../controllers/StoryController.js'
import { protectAdminAndOwner, protectAllWithoutAdmin } from "../middlewares/ProtectMiddleware.js"

//router.post('/add',protectAllWithoutAdmin,addStory) with file in app.js
router.get('/get/:id', protectAdminAndOwner, getStory)
router.delete('/delete/:id', protectAdminAndOwner, deleteStory)
router.post('/get', protectAllWithoutAdmin, getStories)
router.put('/like/:id', protectAllWithoutAdmin, likeStory)
export default router