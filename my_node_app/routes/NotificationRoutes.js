import { Router } from "express"
const router = Router()

import { getNotifications, getNotificationsCounter, deleteNotification } from '../controllers/NotificationController.js'
import { protectAll } from "../middlewares/ProtectMiddleware.js"

router.get('/get', protectAll, getNotifications)
router.get('/counter', protectAll, getNotificationsCounter)
router.delete('/delete/:id', protectAll, deleteNotification)
export default router