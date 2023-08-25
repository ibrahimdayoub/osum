import { Router } from "express"
const router = Router()

import { addSupport, getSupport, updateSupport, deleteSupport, getSupports } from '../controllers/SupportController.js'
import { protectAll, protectAdmin, protectAdminAndOwner } from "../middlewares/ProtectMiddleware.js"

router.post('/add', protectAll, addSupport)
router.get('/get/:id', protectAdminAndOwner, getSupport)
router.put('/update/:id', protectAdmin, updateSupport)
router.delete('/delete/:id', protectAdminAndOwner, deleteSupport)
router.get('/get', protectAll, getSupports)
export default router