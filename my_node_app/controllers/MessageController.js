import asyncHandler from "express-async-handler"
import Validator from 'validatorjs'
import crypto from 'crypto'
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Chat from '../models/ChatModel.js'
import Message from '../models/MessageModel.js'

//Client,Developer,Delegate,Admin
export const getMessagesCounter = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req.body
        const chats = await Chat.find({ users_ids: { $elemMatch: { $eq: middleware_id } } })
        let counter = 0
        for (let i in chats) {
            const messages = await Message.find({ readers_ids: { $ne: middleware_id }, chat_id: chats[i]._id })
            counter += messages.length
        }
        return res.status(200).json({ counter })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,500

//Client,Developer,Delegate,Admin
export const getChatMessages = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req.body
        const existsChat = await Chat.findById(id)
        if (!existsChat) {
            return res.status(404).json({ message: "Chat is not found" })
        }
        let messages = await Message.find({ chat_id: id })

        if (messages.length === 0) {
            return res.status(404).json({ message: "Messages are not found" })
        }
        let counter = 0 //new messages
        /*
            //It runs latest so we can not fetch new updated messages, but we can use for in loop to solve it
            messages.map(async (message) => {
                if (!message.readers_ids.includes(middleware_id)) {
                    counter++;
                    await Message.findByIdAndUpdate(message._id, { $push: { readers_ids: middleware_id } });
                }
            })
        */
        for (let i in messages) {
            if (!messages[i].readers_ids.includes(middleware_id)) {
                counter++;
                await Message.findByIdAndUpdate(messages[i]._id, { $push: { readers_ids: middleware_id } });
            }
        }
        messages = await Message.find({ chat_id: id }).populate('sender_id')
        // messages = messages.map((message) => {
        //     return {
        //         ...message._doc,
        //         content: decrypt(message._doc.content, process.env.ENCRYPT_SECRET_KEY)
        //     }
        // })
        for (let i = 0; i < messages.length; i++) {
            messages[i].content = decrypt(messages[i].content, process.env.ENCRYPT_SECRET_KEY)
        }
        return res.status(200).json({ messages, counter, message: "Messages fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,500

//Client,Developer,Delegate,Admin
export const addMessage = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req;
        const { content, chat_id } = req.body;
        const content_picture = req.file ? req.file.path : null
        if (content_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { content, content_picture, chat_id }
        const rules = {
            content: 'required_without:content_picture|string|between:1,500',
            content_picture: 'required_without:content|string|between:2,100',
            chat_id: 'required|string|between:10,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(chat_id)) {
            return res.status(400).json({ message: "Chat id must be only valid id" })
        }
        const existsChat = await Chat.findById(chat_id)
        if (!existsChat) {
            return res.status(404).json({ message: "Chat is not found" })
        }
        const isValidUser = await Chat.find({ users_ids: { $elemMatch: { $eq: middleware_id } }, _id: chat_id })
        if (!isValidUser[0]) {
            return res.status(404).json({ message: "Chat is not found" })
        }
        const messageObject = {
            content: encrypt(content, process.env.ENCRYPT_SECRET_KEY),
            content_picture,
            sender_id: middleware_id,
            sender_model: middleware_role,
            chat_id,
            readers_ids: [middleware_id]
        };
        let message = await Message.create(messageObject)
        message = await message.populate("sender_id")
        message.content = decrypt(message.content, process.env.ENCRYPT_SECRET_KEY)
        await Chat.findByIdAndUpdate(chat_id, { latest_message: message._id })
        return res.status(201).json({ message_: message, message: "Message sended successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,404,500

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

const encrypt = (text, password) => {
    const cipher = crypto.createCipher('aes-256-cbc', password);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = (encryptedText, password) => {
    const decipher = crypto.createDecipher('aes-256-cbc', password);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/*
    The first query const messages = await Message.find({readers: { $elemMatch: { $eq: user_id } }}) matches documents where the readers array contains at least one element that equals user_id.

    The second query const messages = await Message.find({readers: { $eq: user_id } }) matches documents where the readers array is equal to user_id.

    The third query const messages = await Message.find({readers: { $elemMatch: { $ne: user_id } }}) uses the $elemMatch operator to match documents where the readers array contains at least one element that does not equal user_id.

    The fourth query const messages = await Message.find({readers: { $ne: user_id } }) matches documents where the readers array does not contain user_id.
*/