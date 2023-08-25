import { Router } from "express"
const router = Router()

import { addPost, getPost, updatePost, deletePost, getPosts, likePost, searchPosts, getDashboardPosts } from '../controllers/PostController.js'
import { protectAdmin, protectAdminAndOwner, protectAllWithoutAdmin } from "../middlewares/ProtectMiddleware.js"

//router.post('/add',protectAllWithoutAdmin,addPost) with file in app.js
router.get('/get/:id', protectAllWithoutAdmin, getPost)
//router.put('/update/:id',protectAdminAndOwner,updatePost) with file in app.js
router.delete('/delete/:id', protectAdminAndOwner, deletePost)
router.post('/get', protectAllWithoutAdmin, getPosts)
router.put('/like/:id', protectAllWithoutAdmin, likePost)
router.get('/search', protectAllWithoutAdmin, searchPosts) //ex: http://127.0.0.1:5000/api/posts/search?key=express
router.get('/dashboard-posts', protectAdmin, getDashboardPosts)
export default router