import { createTransport } from 'nodemailer'
import asyncHandler from "express-async-handler"
import jsonwebtoken from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import Validator from 'validatorjs';
import path from "path"

import Client from '../models/ClientModel.js'
import Developer from '../models/DeveloperModel.js'
import Delegate from '../models/DelegateModel.js'
import Admin from '../models/AdminModel.js'
import Token from '../models/TokenModel.js'
import Confirm from '../models/ConfirmModel.js'

const { genSalt, hash, compare } = bcryptjs
const { sign } = jsonwebtoken
const BLOCK_DURATION = 7

//Client,Developer,Delegate
export const signUp = asyncHandler(async (req, res) => {
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
            role: 'required|string|in:Client,Delegate,Developer',
            github_link: req.body.role !== "Client" ? `required|regex:https:\/\/github\.com\/` : 'string',
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
        if (emailExistsInClients || emailExistsInDevelopers || emailExistsInDelegates) {
            return res.status(400).json({ message: "Email is used before" })
        }
        const salt = await genSalt(10)
        const hashedPassword = await hash(password, salt)
        let user = {}
        switch (role) {
            case "Client": user = new Client({ ...req.body, password: hashedPassword, picture_personal_profile }); break;
            case "Developer": user = new Developer({ ...req.body, password: hashedPassword, picture_personal_profile }); break;
            case "Delegate": user = new Delegate({ ...req.body, password: hashedPassword, picture_personal_profile }); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        let token = await generateToken(user._id, user.role)
        await Token.create({ token_value: token, user_role: user.role, user_id: user.id })
        await user.save()
        return res.status(201).json({ user, token, message: "Signed up successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,500

//Client,Developer,Delegate,Admin
export const signIn = asyncHandler(async (req, res) => {
    try {
        const { email, password, role } = req.body
        const data = { email, password, role };
        const rules = {
            email: 'required|email',
            password: 'required|string|between:4,100',
            role: 'required|string|in:Client,Delegate,Developer,Admin'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let user = {}
        switch (role) {
            case "Client": user = await findByCredentials(Client, email, password, res); break;
            case "Developer": user = await findByCredentials(Developer, email, password, res); break;
            case "Delegate": user = await findByCredentials(Delegate, email, password, res); break;
            case "Admin": user = await findByCredentials(Admin, email, password, res); break;
            default:
                {
                    return res.status(400).json({
                        message: `${role} it's undefined role in the system`
                    })
                }
        }
        if (user.end_block_date) {
            let difference = new Date() - user.end_block_date
            if (difference > 0) {
                user.end_block_date = null
                user.save()
            }
            else {
                let rest = Math.ceil(-difference / (1000 * 60 * 60 * 24))
                return res.status(401).json({ message: `You are blocked due to some illegal actions. The notification lasts for ${rest} day/s` })
            }
        }
        let token = await generateToken(user._id, user.role)
        await Token.create({ token_value: token, user_role: user.role, user_id: user.id })
        return res.status(200).json({ user, token, message: "Signed in successfully" })
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //400,404
        }
        if (error instanceof Error) {
            res.status(500).json({ message: error.message })
            // res.status(500).json({ message: "Internal Server Error" })
        }
    }
})//status codes 200,400,404,500

//Client,Developer,Delegate,Admin
export const signOut = asyncHandler(async (req, res) => {
    try {
        const { middleware_token, middleware_role, middleware_id } = req.body
        const storedToken = await Token.findOne({ token_value: middleware_token, user_role: middleware_role, user_id: middleware_id })
        await storedToken.remove()
        return res.status(200).json({ message: "Signed out successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,500

//Client,Developer,Delegate,Admin
export const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { email, role } = req.body
        const data = { email, role };
        const rules = {
            email: 'required|email',
            role: 'required|string|in:Client,Delegate,Developer,Admin'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let user = {}
        switch (role) {
            case "Client": user = await Client.findOne({ email, role }); break;
            case "Developer": user = await Developer.findOne({ email, role }); break;
            case "Delegate": user = await Delegate.findOne({ email, role }); break;
            case "Admin": user = await Admin.findOne({ email, role }); break;
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
        const confirmCode = Math.round(Math.random() * 1000000)

        //with internet
        // const transporter = createTransport({
        //     host: "smtp.googlemail.com",
        //     port: 465,
        //     secure: true,
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: process.env.MAIL_USERNAME,
        //         pass: process.env.MAIL_PASSWORD,
        //         clientId: process.env.OAUTH_CLIENTID,
        //         clientSecret: process.env.OAUTH_CLIENT_SECRET,
        //         refreshToken: process.env.OAUTH_REFRESH_TOKEN
        //     }
        // });
        //without internet
        const transporter = createTransport({
            host: "127.0.0.1",
            port: 1025,
            secure: false
        });
        const mailOptions = {
            from: 'osum.co.team@gmail.com',
            to: email,
            subject: 'Reset password',
            text: 'Reset link ' + process.env.FRONT_END_URL + 'reset-password/' + confirmCode,
        };
        await transporter.sendMail(mailOptions)
        await Confirm.create({
            code_value: confirmCode,
            user_role: user.role,
            user_id: user.id,
            user_email: user.email
        })
        return res.status(200).json({ message: "Reset link sent successfully, check your email" })

    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,404,500

//Client,Developer,Delegate,Admin
export const resetPassword = asyncHandler(async (req, res) => {
    try {
        const { code, email, new_password, confirm_password, role } = req.body
        const data = { code, email, new_password, confirm_password, role };
        const rules = {
            code: 'required',
            email: 'required|email',
            new_password: 'required|string|between:4,100',
            confirm_password: 'required|string|between:4,100|same:new_password',
            role: 'required|string|in:Client,Delegate,Developer'
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const storedCode = await Confirm.findOne({ code_value: code, user_role: role, user_email: email })
        if (!storedCode) {
            return res.status(400).json({ message: "Invalid confirm code " + code })
        }
        const { user_id } = storedCode
        let user = {}
        switch (role) {
            case "Client": user = await Client.findById(user_id); break;
            case "Developer": user = await Developer.findById(user_id); break;
            case "Delegate": user = await Delegate.findById(user_id); break;
            case "Admin": user = await Admin.findById(user_id); break;
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
        const salt = await genSalt(10)
        user.password = await hash(new_password, salt)
        await user.save()
        await storedCode.remove()
        return res.status(200).json({ message: "Password resstored successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,404,500

/*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*#*/

//Helpers functions
const generateToken = async (id, role) => {
    let secretKey = ""
    switch (role) {
        case "Client": secretKey = process.env.JWT_SECRET_ROLE_CLIENT; break;
        case "Developer": secretKey = process.env.JWT_SECRET_ROLE_DEVELOPER; break;
        case "Delegate": secretKey = process.env.JWT_SECRET_ROLE_DELEGATE; break;
        case "Admin": secretKey = process.env.JWT_SECRET_ROLE_ADMIN; break;
        default: secretKey = process.env.JWT_SECRET
    }
    return sign({ mix: id + "|" + role }, secretKey, { expiresIn: '30d' })
}

const findByCredentials = async (model, email, password, res) => {
    const user = await model.findOne({ email })
    if (!user) {
        res.status(404)
        throw new TypeError(model.modelName + ' is not found')
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
        res.status(400)
        throw new TypeError('Password is not match')
    }
    return user
}

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