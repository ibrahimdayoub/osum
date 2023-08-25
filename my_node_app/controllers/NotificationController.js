import asyncHandler from "express-async-handler"

import Notification from '../models/NotificationModel.js'

//Owner
export const getNotifications = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req.body
        let existsNotifications = await Notification.find({ 'receivers': { $elemMatch: { 'receiver_id': middleware_id } } }, { '_id': 1, 'redirect': 1, 'message': 1, 'senders': 1, 'receivers.$': 1, 'createdAt': 1 })
        //let existsNotifications = await Notification.find({'receivers.receiver_id':middleware_id})
        if (existsNotifications.length === 0) {
            return res.status(404).json({ message: "Notifications are not found" })
        }
        let counter = 0
        existsNotifications.map((notification) => {
            if (((notification.receivers)[0]).is_new) {
                counter++
            }
        })
        await Notification.updateMany({ 'receivers': { $elemMatch: { 'receiver_id': middleware_id, 'is_new': true } } }, { '$set': { 'receivers.$.is_new': false } })
        return res.status(200).json({ notifications: existsNotifications, counter, message: "Notifications fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Owner
export const getNotificationsCounter = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req.body
        let existsNotifications = await Notification.find({ 'receivers': { $elemMatch: { 'receiver_id': middleware_id } } }, { '_id': 1, 'redirect': 1, 'message': 1, 'senders': 1, 'receivers.$': 1, 'createdAt': 1 })
        let counter = 0
        existsNotifications.map((notification) => {
            if (((notification.receivers)[0]).is_new) {
                counter++
            }
        })
        return res.status(200).json({ counter })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Owner
export const deleteNotification = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req.body
        let existsNotification = await Notification.findById(id, { 'receivers': 0})
        if (!existsNotification) {
            return res.status(404).json({ message: "Notification is not found" })
        }
        await Notification.update({ '_id': id, 'receivers': { $elemMatch: { 'receiver_id': middleware_id } } }, { '$unset': { 'receivers.$': null } })
        return res.status(200).json({ notification: existsNotification, message: "Notification deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500
