import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';

import Admin from '../models/AdminModel.js'
import Support from '../models/SupportModel.js'
import Notification from '../models/NotificationModel.js'

//Client,Developer,Delegate,Admin (With Add Notification)
export const addSupport = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req.body
        const { subject, message } = req.body
        const data = { subject, message };
        const rules = {
            subject: 'required|string|between:2,200',
            message: 'required|string|between:2,500',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsAsk = await Support.findOne({ subject, message, sender_id: middleware_id })
        if (existsAsk) {
            return res.status(400).json({ message: "Support asked before" })
        }
        //Create Support
        const supportObject = {
            subject,
            message,
            sender_id: middleware_id,
            sender_model: middleware_role,
        }
        const support = await Support.create(supportObject)
        //Create Notification And Notify All Admins
        const admins = await Admin.find()
        const notificationObject = {
            redirect: "support",
            message: `There is an ${(middleware_role).toLowerCase()} requesting support, please respond to its inquiry`,
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: admins.map((admin) => {
                return {
                    receiver_id: admin._id,
                    receiver_model: admin.role
                }
            })
        }
        await Notification.create(notificationObject)
        return res.status(201).json({ support, message: "Support asked successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,401,403,500

//Admin,Owner
export const getSupport = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsAsk = await Support.findById(id).populate(["sender_id"])
        if (!existsAsk) {
            return res.status(404).json({ message: "Support is not found" })
        }
        return res.status(200).json({ support: existsAsk, message: "Support record fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin (With Add Notification)
export const updateSupport = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_role, middleware_id } = req.body
        const { reply } = req.body
        const data = { reply };
        const rules = {
            reply: 'required|string|between:2,500',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsAsk = await Support.findById(id)
        if (!existsAsk) {
            return res.status(404).json({ message: "Support is not found" })
        }
        //Update Support
        const supportObject = {
            reply
        }
        const support = await Support.findByIdAndUpdate(id, supportObject, { returnDocument: 'after' }).populate(["sender_id"])
        //Create Notification And Notify Only Requester
        const notificationObject = {
            redirect: "support",
            message: "From support, your inquiry was recently answered, please check it",
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: [
                {
                    receiver_id: existsAsk.sender_id,
                    receiver_model: existsAsk.sender_model
                }
            ],
        }
        await Notification.create(notificationObject)
        return res.status(200).json({ support, message: "Support answered successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Admin,Owner
export const deleteSupport = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsAsk = await Support.findByIdAndDelete(id)
        if (!existsAsk) {
            return res.status(404).json({ message: "Support is not found" })
        }
        return res.status(200).json({ support: existsAsk, message: "Support deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin,Owner
export const getSupports = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req.body
        let existsAsks = []
        if (middleware_role === "Admin") {
            existsAsks = await Support.find().populate(["sender_id"])
        }
        else {
            existsAsks = await Support.find({ sender_id: middleware_id }).populate(["sender_id"]).sort({ createdAt: -1 })
        }
        if (existsAsks.length <= 0) {
            return res.status(404).json({ message: "Supports are not found" })
        }
        return res.status(200).json({ supports: existsAsks, message: "Supports fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

/*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*/

//Helpers functions
const oneFieldResult = (errors_) => {
    //returns one error for field no array
    const length = (Object.keys(errors_)).length
    let errors = {}
    for (let i = 0; i < length; i++) {
        Object.defineProperty(errors, (Object.keys(errors_))[i], {
            value: (errors_[((Object.keys(errors_))[i])])[0],
            enumerable: true,
            configurable: true,
            writable: true
        });
    }
    return errors
}