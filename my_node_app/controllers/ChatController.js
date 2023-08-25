import asyncHandler from "express-async-handler"
import Validator from 'validatorjs'
import crypto from 'crypto'
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Client from "../models/ClientModel.js";
import Developer from "../models/DeveloperModel.js";
import Delegate from "../models/DelegateModel.js";
import Admin from "../models/AdminModel.js";
import Chat from '../models/ChatModel.js'
import Message from '../models/MessageModel.js'
import Notification from '../models/NotificationModel.js'

//Client,Developer,Delegate,Admin
export const accessChat = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id, target_role, target_id } = req.body
        const data = { target_role, target_id }
        const rules = {
            target_role: 'required|string|in:Client,Delegate,Developer,Admin',
            target_id: 'required|string|between:10,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(target_id)) {
            return res.status(400).json({ message: "Target id must be only valid id" })
        }
        let target = {}
        switch (target_role) {
            case "Client": target = await Client.findById(target_id); break;
            case "Developer": target = await Developer.findById(target_id); break;
            case "Delegate": target = await Delegate.findById(target_id); break;
            case "Admin": target = await Admin.findById(target_id); break;
            default:
                {
                    return res.status(400).json({
                        message: `${target_role} it's undefined role in the system`
                    })
                }
        }
        if (!target) {
            return res.status(404).json({ message: target_role + " is not found" })
        }

        let chat = await Chat.find({
            is_group: false,
            $and: [
                { users_ids: { $elemMatch: { $eq: middleware_id } } },
                { users_ids: { $elemMatch: { $eq: target_id } } }
            ],
        })
        if (chat.length > 0) {
            let chats = await Chat.populate(await Chat.aggregate([
                {
                    $lookup: {
                        from: 'admins',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'admin_users'
                    }
                },
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'client_users'
                    }
                },
                {
                    $lookup: {
                        from: 'developers',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'developer_users'
                    }
                },
                {
                    $lookup: {
                        from: 'delegates',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'delegate_users'
                    }
                }
            ]), ["owner_id", { path: "latest_message", populate: { path: "sender_id" } }])
            chats = chats.filter((chat_) => {
                return (chat_._id).toString() === (chat[0]._id).toString()
            })
            chats.map(async (chat) => {
                let users = []
                if (chat.client_users.length > 0) {
                    users.push(...chat.client_users)
                }
                if (chat.developer_users.length > 0) {
                    users.push(...chat.developer_users)
                }
                if (chat.delegate_users.length > 0) {
                    users.push(...chat.delegate_users)
                }
                if (chat.admin_users.length > 0) {
                    users.push(...chat.admin_users)
                }
                chat.users_ids = users
            })
            for (let i in chats) {
                let messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
                chats[i].counter = messages.length
            }
            return res.status(200).json({ chat: chats[0], message: "Chat fetched successfully" })
        }
        else {
            const chatObject = {
                chat_name: `${middleware_role} to ${(target_role).toLowerCase()} chat`,
                users_ids: [middleware_id, target_id],
                owner_id: middleware_id,
                owner_model: middleware_role,
                latest_message: null
            };
            chat = await Chat.create(chatObject)
            let chats = await Chat.populate(await Chat.aggregate([
                {
                    $lookup: {
                        from: 'admins',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'admin_users'
                    }
                },
                {
                    $lookup: {
                        from: 'clients',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'client_users'
                    }
                },
                {
                    $lookup: {
                        from: 'developers',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'developer_users'
                    }
                },
                {
                    $lookup: {
                        from: 'delegates',
                        localField: 'users_ids',
                        foreignField: '_id',
                        as: 'delegate_users'
                    }
                }
            ]), ["owner_id"])
            chats = chats.filter((chat_) => {
                return (chat_._id).toString() === (chat._id).toString()
            })
            chats.map(async (chat) => {
                let users = []
                if (chat.client_users.length > 0) {
                    users.push(...chat.client_users)
                }
                if (chat.developer_users.length > 0) {
                    users.push(...chat.developer_users)
                }
                if (chat.delegate_users.length > 0) {
                    users.push(...chat.delegate_users)
                }
                if (chat.admin_users.length > 0) {
                    users.push(...chat.admin_users)
                }
                chat.users_ids = users
            })
            for (let i in chats) {
                let messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
                chats[i].counter = messages.length
            }
            return res.status(201).json({ chat: chats[0], message: "Chat created successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,201,400,401,403,500

//Owner
export const deleteChat = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsChat = await Chat.findByIdAndDelete(id)
        if (!existsChat) {
            return res.status(404).json({ message: "Chat is not found" })
        }
        const existsMessages = await Message.find({ chat_id: id })
        existsMessages.map(async (message) => {
            await Message.findByIdAndDelete(message._id)
        })
        return res.status(200).json({ chat: existsChat, message: "Chat deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,404,401,403,500

//Client,Developer,Delegate,Admin
export const getChats = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req.body
        let chats = await Chat.populate(await Chat.aggregate([
            {
                $lookup: {
                    from: 'admins',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'admin_users'
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'client_users'
                }
            },
            {
                $lookup: {
                    from: 'developers',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'developer_users'
                }
            },
            {
                $lookup: {
                    from: 'delegates',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'delegate_users'
                }
            }
        ]).sort({ updatedAt: -1 }), ["owner_id", { path: "latest_message", populate: { path: "sender_id" } }])
        chats = chats.filter((chat_) => {
            const users_ids = JSON.stringify(chat_.users_ids)
            const middleware_id_ = JSON.stringify(middleware_id)
            return users_ids.includes(middleware_id_)
        })
        if (chats.length === 0) {
            return res.status(404).json({ message: "Chats are not found" })
        }
        chats.map(async (chat) => {
            let users = []
            if (chat.client_users.length > 0) {
                users.push(...chat.client_users)
            }
            if (chat.developer_users.length > 0) {
                users.push(...chat.developer_users)
            }
            if (chat.delegate_users.length > 0) {
                users.push(...chat.delegate_users)
            }
            if (chat.admin_users.length > 0) {
                users.push(...chat.admin_users)
            }
            chat.users_ids = users
        })
        for (let i in chats) {
            let messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
            chats[i].counter = messages.length
            if (chats[i].latest_message?.content) {
                chats[i].latest_message = {
                    ...chats[i].latest_message._doc,
                    content: decrypt(chats[i].latest_message.content, process.env.ENCRYPT_SECRET_KEY)
                }
            }
        }
        return res.status(200).json({ chats, message: "Chats fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,500

//Client,Developer,Delegate,Admin
export const createGroup = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        let { group_name, users_ids } = req.body
        const group_picture = req.file ? req.file.path : null
        if (group_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        users_ids = String(users_ids).split(',') //Because it is string from (form data)
        const data = { group_name, users_ids }
        const rules = {
            group_name: 'required|string|between:2,50',
            users_ids: 'required|array|between:2,100',
            group_picture: 'string|between:2,100'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        for (let i in users_ids) {
            if (!isObjectIdOrHexString(users_ids[i])) {
                return res.status(400).json({ message: "Users ids must contains only valid ids" })
            }
        }
        const existsChat = await Chat.find({ chat_name: group_name, owner_id: middleware_id })
        if (existsChat.length > 0) {
            return res.status(400).json({ message: "You have already group chat with same name" })
        }
        users_ids.push(middleware_id)
        const groupObject = {
            chat_name: group_name,
            chat_picture: group_picture,
            is_group: true,
            users_ids: users_ids,
            owner_id: middleware_id,
            owner_model: middleware_role,
            latest_message: null
        }
        let chat = await Chat.create(groupObject);
        let chats = await Chat.populate(await Chat.aggregate([
            {
                $lookup: {
                    from: 'admins',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'admin_users'
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'client_users'
                }
            },
            {
                $lookup: {
                    from: 'developers',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'developer_users'
                }
            },
            {
                $lookup: {
                    from: 'delegates',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'delegate_users'
                }
            }
        ]), ["owner_id"])
        chats = chats.filter((chat_) => {
            return (chat_._id).toString() === (chat._id).toString()
        })
        chats.map(async (chat) => {
            let users = []
            if (chat.client_users.length > 0) {
                users.push(...chat.client_users)
            }
            if (chat.developer_users.length > 0) {
                users.push(...chat.developer_users)
            }
            if (chat.delegate_users.length > 0) {
                users.push(...chat.delegate_users)
            }
            if (chat.admin_users.length > 0) {
                users.push(...chat.admin_users)
            }
            chat.users_ids = users
        })
        for (let i in chats) {
            let messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
            chats[i].counter = messages.length
        }
        //Create Notification And Notify All Members (Users)
        const notificationObject = {
            redirect: "messenger",
            message: `There is a new group created, and you added as member in it`,
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: chats[0].users_ids.map((user_id) => {
                if ((user_id._id).toString() === (middleware_id).toString()) {
                    return null
                }
                return {
                    receiver_id: user_id._id,
                    receiver_model: user_id.role
                }
            })
        }
        await Notification.create(notificationObject)
        return res.status(201).json({ chat: chats[0], message: "Group chat created successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

////Owner
export const updateGroup = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let { group_name, users_ids } = req.body
        const group_picture = req.file ? req.file.path : null
        if (group_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        users_ids = String(users_ids).split(',') //Because it is string from (form data)
        const data = { group_name, users_ids }
        const rules = {
            group_name: 'string|between:2,50',
            users_ids: 'array|between:2,100',
            group_picture: 'string|between:2,100'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        for (let i in users_ids) {
            if (!isObjectIdOrHexString(users_ids[i])) {
                return res.status(400).json({ message: "Users ids must contains only valid ids" })
            }
        }
        const existsChat = await Chat.find({ chat_name: group_name, owner_id: middleware_id })
        if (existsChat.length > 0 && (existsChat[0]._id).toString() !== (id).toString()) {
            return res.status(400).json({ message: "You have already group chat with same name" })
        }
        users_ids.push(middleware_id)
        let groupObject = {}
        if (group_picture) {
            groupObject = {
                chat_name: group_name,
                chat_picture: group_picture,
                users_ids: users_ids,
            }
        }
        else {
            groupObject = {
                chat_name: group_name,
                users_ids: users_ids,
            }
        }
        let chat = await Chat.findByIdAndUpdate(id, groupObject);
        let chats = await Chat.populate(await Chat.aggregate([
            {
                $lookup: {
                    from: 'admins',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'admin_users'
                }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'client_users'
                }
            },
            {
                $lookup: {
                    from: 'developers',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'developer_users'
                }
            },
            {
                $lookup: {
                    from: 'delegates',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'delegate_users'
                }
            }
        ]), ["owner_id"])
        chats = chats.filter((chat_) => {
            return (chat_._id).toString() === (chat._id).toString()
        })
        chats.map(async (chat) => {
            let users = []
            if (chat.client_users.length > 0) {
                users.push(...chat.client_users)
            }
            if (chat.developer_users.length > 0) {
                users.push(...chat.developer_users)
            }
            if (chat.delegate_users.length > 0) {
                users.push(...chat.delegate_users)
            }
            if (chat.admin_users.length > 0) {
                users.push(...chat.admin_users)
            }
            chat.users_ids = users
        })
        for (let i in chats) {
            let messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
            chats[i].counter = messages.length
        }
        return res.status(200).json({ chat: chats[0], message: "Group chat updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Owner
export const leaveGroup = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.body
        const data = { user_id }
        const rules = {
            user_id: 'required|string|between:10,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }

        if (!isObjectIdOrHexString(user_id)) {
            return res.status(400).json({ message: "Target id must be only valid id" })
        }
        let chat = await Chat.findById(id)
        const users_ids = JSON.stringify(chat.users_ids)
        const target_id_ = JSON.stringify(user_id)
        if (!users_ids.includes(target_id_)) {
            return res.status(400).json({ message: "User is already not found" })
        }
        chat = await Chat.findByIdAndUpdate(id, { $pull: { users_ids: user_id } }, { new: true })
        return res.status(200).json({ chat, message: "Group chat leaved successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,500

//Owner
export const leaveChat = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { user_id } = req.body
        const data = { user_id }
        const rules = {
            user_id: 'required|string|between:10,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(user_id)) {
            return res.status(400).json({ message: "Target id must be only valid id" })
        }
        let chat = await Chat.findById(id)
        const users_ids = JSON.stringify(chat.users_ids)
        const target_id_ = JSON.stringify(user_id)
        if (!users_ids.includes(target_id_)) {
            return res.status(400).json({ message: "User is already not found" })
        }
        chat = await Chat.findByIdAndUpdate(id, { $pull: { users_ids: user_id } }, { new: true })
        return res.status(200).json({ chat, message: "Chat leaved successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,500

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

const decrypt = (encryptedText, password) => {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/*
    //Aggregate example:
    const chats = await Chat.populate(await Chat.aggregate([
        {
            $lookup: {
                from: 'admins',
                localField: 'users_ids',
                foreignField: '_id',
                as: 'admin_users'
            }
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'client_users'
                }
            },
            {
                $lookup: {
                    from: 'developers',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'developer_users'
                }
            },
            {
                $lookup: {
                    from: 'delegates',
                    localField: 'users_ids',
                    foreignField: '_id',
                    as: 'delegate_users'
                }
            }
    ]), [{ path: "owner_id" }])
    //Returns array
*/