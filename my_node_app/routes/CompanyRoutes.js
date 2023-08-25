import { Router } from "express"
const router = Router()

import { addCompany, getCompany, updateCompany, deleteCompany, likeCompany } from '../controllers/CompanyController.js'
import { protectDelegate, protectAllWithoutAdmin, protectAll } from "../middlewares/ProtectMiddleware.js"

router.post('/add', protectDelegate, addCompany)
router.get('/get/:id', protectAll, getCompany)
router.put('/update/:id', protectDelegate, updateCompany)
router.delete('/delete/:id', protectDelegate, deleteCompany)
router.put('/like/:id', protectAllWithoutAdmin, likeCompany)
export default router