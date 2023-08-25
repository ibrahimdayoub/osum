import { Router } from "express"
const router = Router()

import { addTask, getTask, updateTask, checkTask, deleteTask, getTasks, getDashboardTasks } from '../controllers/TaskController.js'
import { protectAdmin, protectAll, protectDeveloperDelegate } from "../middlewares/ProtectMiddleware.js"

router.post('/add', protectDeveloperDelegate, addTask)
router.get('/get/:id', protectDeveloperDelegate, getTask)
router.put('/update/:id', protectDeveloperDelegate, updateTask)
router.put('/check/:id', protectDeveloperDelegate, checkTask)
router.delete('/delete/:id', protectAll, deleteTask)
router.post('/get', protectDeveloperDelegate, getTasks)
router.get('/dashboard-tasks', protectAdmin, getDashboardTasks)
export default router