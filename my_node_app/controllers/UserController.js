import asyncHandler from "express-async-handler"
import bcryptjs from 'bcryptjs'
import Validator from 'validatorjs';
import path from "path"

import Client from '../models/ClientModel.js'
import Developer from '../models/DeveloperModel.js'
import Delegate from '../models/DelegateModel.js'
import Admin from '../models/AdminModel.js'
import Token from '../models/TokenModel.js'
import Notification from '../models/NotificationModel.js'

const { genSalt, hash } = bcryptjs
const BLOCK_DURATION = 7

//Admin
export const addUser = asyncHandler(async (req, res) => {
    try {
        const { first_name, last_name, address, email, password, role, github_link, field_of_work } = req.body
        const picture_personal_profile = req.file ? req.file.path : null
        if (picture_personal_profile) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { first_name, last_name, address, email, password, role, github_link, field_of_work, picture_personal_profile };
        const rules = {
            first_name: 'required|string|between:2,50',
            last_name: 'required|string|between:2,50',
            address: 'required|string|between:2,100',
            email: 'required|email',
            password: 'required|string|between:4,100',
            role: 'required|string|in:Client,Delegate,Developer,Admin',
            github_link: !(req.body.role === "Client" || req.body.role === "Admin") ? `required|regex:https:\/\/github\.com\/` : '',
            field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
            picture_personal_profile: 'string|between:2,100'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const emailExistsInClients = await Client.findOne({ email })
        const emailExistsInDevelopers = await Developer.findOne({ email })
        const emailExistsInDelegates = await Delegate.findOne({ email })
        const emailExistsInAdmins = await Admin.findOne({ email })
        if (emailExistsInClients || emailExistsInDevelopers || emailExistsInDelegates || emailExistsInAdmins) {
            return res.status(400).json({ message: "Email is used before" })
        }
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        const dataObject = {
            first_name,
            last_name,
            address,
            email,
            role,
            github_link,
            field_of_work,
            password: hashedPassword,
            picture_personal_profile
        }
        let user = {}
        switch (role) {
            case "Client": user = await Client.create(dataObject); break;
            case "Developer": user = await Developer.create(dataObject); break;
            case "Delegate": user = await Delegate.create(dataObject); break;
            case "Admin": user = await Admin.create(dataObject); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        return res.status(201).json({ user, message: role + " added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,401,403,500

//Admin,Owner
export const getUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const { role } = req.body //role: we want get it not role of an authenticated user
        const data = { role }
        const rules = {
            role: 'required|string|in:Client,Delegate,Developer,Admin',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let user = {}
        switch (role) {
            case "Client": user = await Client.findById(id); break;
            case "Developer": user = await Developer.findById(id); break;
            case "Delegate": user = await Delegate.findById(id); break;
            case "Admin": user = await Admin.findById(id); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (!user) {
            return res.status(404).json({ message: role + " is not found" })
        }
        return res.status(200).json({ user, message: role + " fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Admin,Owner
export const updateUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const { first_name, last_name, address, email, password, role, github_link, field_of_work } = req.body //role: we want update it not role of an authenticated user
        const picture_personal_profile = req.file ? req.file.path : null
        if (picture_personal_profile) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { first_name, last_name, address, email, password, role, github_link, field_of_work, picture_personal_profile };
        const rules = {
            first_name: 'string|between:2,50',
            last_name: 'string|between:2,50',
            address: 'string|between:2,100',
            email: 'email',
            password: 'string|between:4,100',
            role: 'required|string|in:Client,Delegate,Developer,Admin',
            github_link: `regex:https:\/\/github\.com\/`,
            field_of_work: 'string|in:Programming,Designing,Content Writing,Translation',
            picture_personal_profile: 'string|between:2,100'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (email) {
            const emailExistsInClients = await Client.findOne({ email })
            const emailExistsInDevelopers = await Developer.findOne({ email })
            const emailExistsInDelegates = await Delegate.findOne({ email })
            const emailExistsInAdmins = await Admin.findOne({ email })
            if ((emailExistsInClients && emailExistsInClients._id != id) || (emailExistsInDevelopers && emailExistsInDevelopers._id != id) || (emailExistsInDelegates && emailExistsInDelegates._id != id) || (emailExistsInAdmins && emailExistsInAdmins._id != id)) {
                return res.status(400).json({ message: "Email is used before" })
            }
        }
        let dataObject = {}
        if (password && picture_personal_profile) {
            const salt = await genSalt(10)
            const hashedPassword = await hash(password, salt)
            dataObject = {
                first_name,
                last_name,
                address,
                email,
                role,
                github_link,
                field_of_work,
                password: hashedPassword,
                picture_personal_profile
            }
        }
        else if (password && !picture_personal_profile) {
            const salt = await genSalt(10)
            const hashedPassword = await hash(password, salt)
            dataObject = {
                first_name,
                last_name,
                address,
                email,
                role,
                github_link,
                field_of_work,
                password: hashedPassword
            }
        }
        else if (!password && picture_personal_profile) {
            dataObject = {
                first_name,
                last_name,
                address,
                email,
                role,
                github_link,
                field_of_work,
                picture_personal_profile
            }
        }
        else if (!password && !picture_personal_profile) {
            dataObject = {
                first_name,
                last_name,
                address,
                email,
                role,
                github_link,
                field_of_work,
            }
        }
        let user = {}
        switch (role) {
            case "Client": user = await Client.findByIdAndUpdate(id, dataObject, { returnDocument: 'after' }); break;
            case "Developer": user = await Developer.findByIdAndUpdate(id, dataObject, { returnDocument: 'after' }); break;
            case "Delegate": user = await Delegate.findByIdAndUpdate(id, dataObject, { returnDocument: 'after' }); break;
            case "Admin": user = await Admin.findByIdAndUpdate(id, dataObject, { returnDocument: 'after' }); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (!user) {
            return res.status(404).json({ message: role + " is not found" })
        }

        return res.status(200).json({ user, message: role + " updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Admin,Owner
export const deleteUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const { middleware_id, middleware_role } = req
        const { role } = req.body //role: that we want delete it not role of an authenticated user
        console.log("role", role)
        const data = { role }
        const rules = {
            role: 'required|string|in:Client,Delegate,Developer,Admin',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            console.log(req.body.role)
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (role === "Admin" && (await Admin.find()).length === 1) {
            return res.status(404).json({ message: "Can not delete last admin in the system" })
        }
        else {
            let user = {}
            switch (role) {
                case "Client": user = await Client.findByIdAndDelete(id); break;
                case "Developer": user = await Developer.findByIdAndDelete(id); break;
                case "Delegate": user = await Delegate.findByIdAndDelete(id); break;
                case "Admin": user = await Admin.findByIdAndDelete(id); break;
                default:
                    {
                        return res.status(400).json({
                            message: `${role} it's undefined role in the system`
                        })
                    }
            }
            if (!user) {
                return res.status(404).json({ message: role + " is not found" })
            }
            if ((middleware_id).toString() === (id).toString()) {
                const storedToken = await Token.findOne({ user_id: id })
                await storedToken.remove()
            }
            return res.status(200).json({ user, message: role + " deleted successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Admin
export const getUsers = asyncHandler(async (req, res) => {
    try {
        const { role } = req.body //role: we want get it not role of an authenticated user
        const data = { role }
        const rules = {
            role: 'required|string|in:Client,Delegate,Developer,Admin',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let users = []
        switch (role) {
            case "Client": users = await Client.find(); break;
            case "Developer": users = await Developer.find(); break;
            case "Delegate": users = await Delegate.find(); break;
            case "Admin": users = await Admin.find(); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (users.length === 0) {
            return res.status(404).json({ message: role + "s are not found" })
        }
        return res.status(200).json({ users, message: role + "s fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const visitUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const { role, middleware_id } = req.body //role: we want update it not role of an authenticated user
        const data = { role };
        const rules = {
            role: 'required|string|in:Client,Delegate,Developer',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }

        let user = {}
        switch (role) {
            case "Client": user = await Client.findById(id); break;
            case "Developer": user = await Developer.findById(id); break;
            case "Delegate": user = await Delegate.findById(id); break;
            case "Admin": user = await Admin.findById(id); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (!user) {
            return res.status(404).json({ message: role + " is not found" })
        }

        if ((id).toString() !== (middleware_id).toString()) {
            let views = user.views_personal_profile + 1
            user.views_personal_profile = views
            user.save()
            return res.status(200).json({ user, message: role + " visited successfully" })
        }

        return res.status(200).json(null)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const rateUser = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id
        const { rate, role, middleware_id, middleware_role } = req.body //role: we want update it not role of an authenticated user
        const data = { rate, role };
        const rules = {
            rate: 'required|integer|between:0,7',
            role: 'required|string|in:Client,Delegate,Developer',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let user = {}
        switch (role) {
            case "Client": user = await Client.findById(id); break;
            case "Developer": user = await Developer.findById(id); break;
            case "Delegate": user = await Delegate.findById(id); break;
            case "Admin": user = await Admin.findById(id); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (!user) {
            return res.status(404).json({ message: role + " is not found" })
        }
        let rates = user.rate_personal_profile
        rates = rates.filter((rate) => {
            return (rate.rater_id).toString() !== (middleware_id).toString()
        })
        rates.push({ rater_id: middleware_id, rater_model: middleware_role, rate: rate })
        let totalRate = 0;
        let numberOfVoters = rates.length;
        rates.map((rate) => {
            totalRate += rate.rate
        })
        totalRate = Math.round(totalRate / numberOfVoters)
        user.rate_personal_profile = rates
        user.save()
        // Create Notification And Notify Only User
        const notificationObject = {
            redirect: `profile/${id}`,
            message: `There is a new rate created, go to your profile and check it`,
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: [
                {
                    receiver_id: id,
                    receiver_model: role
                }
            ]
        }
        await Notification.create(notificationObject)
        return res.status(200).json({ user, message: role + " rated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate,Admin
export const searchUsers = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req.body
        const key = req.query.key
            ? {
                $or: [
                    { first_name: { $regex: req.query.key, $options: "i" } },
                    { last_name: { $regex: req.query.key, $options: "i" } },
                    { email: { $regex: req.query.key, $options: "i" } },
                    { role: { $regex: req.query.key, $options: "i" } },
                ],
            }
            : {};
        const clients = await Client.find(key).find({ _id: { $ne: middleware_id } });
        const developers = await Developer.find(key).find({ _id: { $ne: middleware_id } });
        const delegates = await Delegate.find(key).find({ _id: { $ne: middleware_id } });
        const admins = await Admin.find(key).find({ _id: { $ne: middleware_id } });
        let users = []
        if (middleware_role !== "Admin") {
            users = [...clients, ...developers, ...delegates]
        }
        else {
            // users = [...admins]
            users = [...clients,...developers,...delegates,...admins]
        }
        if (users.length === 0) {
            return res.status(404).json({ message: "Users are not found" })
        }

        return res.status(200).json({ users, message: "Users fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin
export const addAdmin = asyncHandler(async (req, res) => {
    try {
        const { first_name, last_name, address, email, password } = req.body
        const data = { first_name, last_name, address, email, password };
        const rules = {
            first_name: 'required|string|between:2,50',
            last_name: 'required|string|between:2,50',
            address: 'required|string|between:2,100',
            email: 'required|email',
            password: 'required|string|between:4,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const emailExistsInAdmins = await Admin.findOne({ email })
        if (emailExistsInAdmins) {
            return res.status(400).json({ message: "Email is used before" })
        }
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        let admin = new Admin({ ...req.body, role: "Admin", password: hashedPassword })
        await admin.save()
        return res.status(201).json({ message: "Admin added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,500

//Admin
export const blockUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        let user = await Client.findById(id)
        if (!user) {
            user = await Developer.findById(id)
        }
        if (!user) {
            user = await Delegate.findById(id)
        }
        if (!user) {
            return res.status(404).json({ message: "User is not found" })
        }
        if (!user.end_block_date) {
            user.end_block_date = new Date(new Date().getTime() + (BLOCK_DURATION * 24 * 60 * 60 * 1000))
            user.save()
            return res.status(200).json({ user, message: `User blocked successfully for ${BLOCK_DURATION} day/s` })
        }
        else {
            user.end_block_date = null
            user.save()
            return res.status(200).json({ user, message: `User unblocked successfully` })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,404,500

//Admin
export const getDashboardUsers = asyncHandler(async (req, res) => {
    try {
        let users = []
        const clients = await Client.find()
        const developers = await Developer.find()
        const delegates = await Delegate.find()
        users = [...clients, ...developers, ...delegates]
        if (users.length === 0) {
            return res.status(404).json({ message: "Users are not found" })
        }
        return res.status(200).json({ users, message: "Users fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

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