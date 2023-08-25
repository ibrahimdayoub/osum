import { Router } from "express"
const router = Router()

import { addUser, getUser, updateUser, deleteUser, getUsers, visitUser, rateUser, searchUsers, addAdmin, blockUser, getDashboardUsers } from '../controllers/UserController.js'
import { protectAll, protectAdmin, protectAdminAndOwner } from "../middlewares/ProtectMiddleware.js"

//router.post('/add',protectAdmin,addUser) with file in app.js
router.post('/get/:id', protectAll, getUser)
//router.put('/update/:id',protectAdminAndOwner,updateUser) with file in app.js
router.post('/delete/:id', protectAdminAndOwner, deleteUser)
router.get('/get', protectAdmin, getUsers)
router.put('/visit/:id', protectAll, visitUser)
router.put('/rate/:id', protectAll, rateUser)
router.get('/search', protectAll, searchUsers) //ex: http://127.0.0.1:5000/api/users/search?key=ibrahim
router.post('/add-admin', protectAdmin, addAdmin)
router.get('/block-user/:id', protectAdmin, blockUser)
router.get('/dashboard-users', protectAdmin, getDashboardUsers)
export default router