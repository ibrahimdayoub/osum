import { Router } from "express"
const router = Router()

import { addService, getService, updateService, deleteService, getServices, likeService, searchServices, getDashboardServices } from '../controllers/ServiceController.js'
import { protectAdmin, protectAll, protectAllWithoutAdmin, protectDeveloperDelegate } from "../middlewares/ProtectMiddleware.js"

router.post('/add', protectDeveloperDelegate, addService)
router.get('/get/:id', protectAll, getService)
router.put('/update/:id', protectDeveloperDelegate, updateService)
router.delete('/delete/:id', protectAll, deleteService)
router.post('/get', protectAllWithoutAdmin, getServices)
router.put('/like/:id', protectAllWithoutAdmin, likeService)
router.get('/search', protectAllWithoutAdmin, searchServices) //ex: http://127.0.0.1:5000/api/services/search?key=express
router.get('/dashboard-services', protectAdmin, getDashboardServices)
export default router