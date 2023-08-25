import { Router } from "express"
const router = Router()

import { addProject, completeProject, getDashboardProjects, getProject, getProjects, likeProject, retreatProject, searchProjects, updateProject } from '../controllers/ProjectController.js'
import { protectAdmin, protectAllWithoutAdmin, protectDeveloperDelegate } from "../middlewares/ProtectMiddleware.js"

router.post('/add', protectDeveloperDelegate,addProject)
router.get('/get/:id', protectDeveloperDelegate, getProject)
router.put('/update/:id', protectDeveloperDelegate,updateProject)
router.post('/get', protectAllWithoutAdmin, getProjects)
router.put('/complete/:id', protectAllWithoutAdmin, completeProject)
router.put('/retreat/:id', protectAllWithoutAdmin, retreatProject)
router.put('/like/:id', protectAllWithoutAdmin, likeProject)
router.get('/search', protectAllWithoutAdmin, searchProjects) //ex: http://127.0.0.1:5000/api/projects/search?key=express
router.get('/dashboard-projects', protectAdmin, getDashboardProjects)
export default router