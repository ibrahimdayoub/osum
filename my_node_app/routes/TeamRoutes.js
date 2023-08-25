import { Router } from "express"
const router = Router()

import { addTeam, getTeam, updateTeam, deleteTeam, getTeams, leaveTeam, getDashboardTeams} from '../controllers/TeamController.js'
import { protectAdmin, protectAll, protectDeveloper, protectDeveloperDelegate } from "../middlewares/ProtectMiddleware.js"

// router.post('/add', protectDeveloperDelegate,addTeam) with file in app.js
router.get('/get/:id', protectDeveloperDelegate, getTeam)
// router.put('/update/:id', protectDeveloperDelegate,updateTeam) with file in app.js
router.delete('/delete/:id', protectAll, deleteTeam)
router.get('/get', protectDeveloperDelegate, getTeams)
router.put('/leave/:id', protectDeveloper, leaveTeam)
router.get('/dashboard-teams', protectAdmin, getDashboardTeams)
export default router