import asyncHandler from "express-async-handler"
import jsonwebtoken from 'jsonwebtoken'

import Client from "../models/ClientModel.js"
import Developer from "../models/DeveloperModel.js"
import Delegate from "../models/DelegateModel.js"
import Admin from "../models/AdminModel.js"
import Token from "../models/TokenModel.js"
import Support from "../models/SupportModel.js"
import Chat from "../models/ChatModel.js"
import Post from "../models/PostModel.js"
import Comment from "../models/CommentModel.js"

const { verify } = jsonwebtoken

export const protectAll = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1]

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_CLIENT) }
            catch (error) {/*throw new Error("1")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DEVELOPER) }
            catch (error) {/*throw new Error("2")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DELEGATE) }
            catch (error) {/*throw new Error("3")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_ADMIN) }
            catch (error) {/*throw new Error("4")*/ }

            if (!decoded) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have user access")
            }

            const id = (decoded.mix).split("|")[0]
            const role = (decoded.mix).split("|")[1]

            let user = {}
            switch (role) {
                case "Client": user = await Client.findById(id); break;
                case "Developer": user = await Developer.findById(id); break;
                case "Delegate": user = await Delegate.findById(id); break;
                case "Admin": user = await Admin.findById(id); break;
                default:
                    {
                        res.status(403)
                        throw new TypeError(`Unauthenticated ${role} in the system`)
                    }
            }
            if (!user) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up " + role.toLowerCase())
            }

            if (user.end_block_date && req.url !== "/sign-out") {
                console.log()
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

            const storedToken = await Token.findOne({ token_value: token })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in " + role.toLowerCase())
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id
            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have user access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectAllWithoutAdmin = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1]

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_CLIENT) }
            catch (error) {/*throw new Error("1")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DEVELOPER) }
            catch (error) {/*throw new Error("2")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DELEGATE) }
            catch (error) {/*throw new Error("3")*/ }

            if (!decoded) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have user access")
            }

            const id = (decoded.mix).split("|")[0]
            const role = (decoded.mix).split("|")[1]

            let user = {}
            switch (role) {
                case "Client": user = await Client.findById(id); break;
                case "Developer": user = await Developer.findById(id); break;
                case "Delegate": user = await Delegate.findById(id); break;
                default:
                    {
                        res.status(403)
                        throw new TypeError(`Unauthenticated ${role} in the system`)
                    }
            }
            if (!user) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up " + role.toLowerCase())
            }

            if (user.end_block_date && req.url !== "/sign-out") {
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

            const storedToken = await Token.findOne({ token_value: token })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in " + role.toLowerCase())
            }
            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id
            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have user access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectDeveloperDelegate = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1]

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DEVELOPER) }
            catch (error) {/*throw new Error("2")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DELEGATE) }
            catch (error) {/*throw new Error("3")*/ }

            if (!decoded) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have developer or delegate access")
            }

            const id = (decoded.mix).split("|")[0]
            const role = (decoded.mix).split("|")[1]

            let user = {}
            switch (role) {
                case "Developer": user = await Developer.findById(id); break;
                case "Delegate": user = await Delegate.findById(id); break;
                default:
                    {
                        res.status(403)
                        throw new TypeError(`Unauthenticated ${role} in the system`)
                    }
            }
            if (!user) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up " + role.toLowerCase())
            }

            if (user.end_block_date && req.url !== "/sign-out") {
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

            const storedToken = await Token.findOne({ token_value: token })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in " + role.toLowerCase())
            }
            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id
            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have developer or delegate access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectClient = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]

            try {
                decoded = verify(token, process.env.JWT_SECRET_ROLE_CLIENT)
            }
            catch (error) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have client access")
            }

            const client = await Client.findById(decoded.mix.split("|")[0])
            if (!client) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up client")
            }

            if (client.end_block_date && req.url !== "/sign-out") {
                let difference = new Date() - client.end_block_date
                if (difference > 0) {
                    client.end_block_date = null
                    client.save()
                }
                else {
                    let rest = Math.ceil(-difference / (1000 * 60 * 60 * 24))
                    return res.status(401).json({ message: `You are blocked due to some illegal actions. The notification lasts for ${rest} day/s` })
                }
            }

            const storedToken = await Token.findOne({ token_value: token, user_role: "Client" })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in client")
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id

            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have client access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectDeveloper = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]

            try {
                decoded = verify(token, process.env.JWT_SECRET_ROLE_DEVELOPER)
            }
            catch (error) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have developer access")
            }

            const developer = await Developer.findById(decoded.mix.split("|")[0])
            if (!developer) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up developer")
            }

            if (developer.end_block_date && req.url !== "/sign-out") {
                let difference = new Date() - developer.end_block_date
                if (difference > 0) {
                    developer.end_block_date = null
                    developer.save()
                }
                else {
                    let rest = Math.ceil(-difference / (1000 * 60 * 60 * 24))
                    return res.status(401).json({ message: `You are blocked due to some illegal actions. The notification lasts for ${rest} day/s` })
                }
            }

            const storedToken = await Token.findOne({ token_value: token, user_role: "Developer" })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in developer")
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id

            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have developer access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectDelegate = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]

            try {
                decoded = verify(token, process.env.JWT_SECRET_ROLE_DELEGATE)
            }
            catch (error) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have delegate access")
            }

            const delegate = await Delegate.findById(decoded.mix.split("|")[0])
            if (!delegate) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up delegate")
            }

            const storedToken = await Token.findOne({ token_value: token, user_role: "Delegate" })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in delegate")
            }

            if (delegate.end_block_date && req.url !== "/sign-out") {
                let difference = new Date() - delegate.end_block_date
                if (difference > 0) {
                    delegate.end_block_date = null
                    delegate.save()
                }
                else {
                    let rest = Math.ceil(-difference / (1000 * 60 * 60 * 24))
                    return res.status(401).json({ message: `You are blocked due to some illegal actions. The notification lasts for ${rest} day/s` })
                }
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id

            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have delegate access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectAdmin = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]

            try {
                decoded = verify(token, process.env.JWT_SECRET_ROLE_ADMIN)
            }
            catch (error) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have admin access")
            }

            const admin = await Admin.findById(decoded.mix.split("|")[0])
            if (!admin) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up admin")
            }

            const storedToken = await Token.findOne({ token_value: token, user_role: "Admin" })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in admin")
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id

            next()
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have admin access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})

export const protectAdminAndOwner = asyncHandler(async (req, res, next) => {
    try {
        let token = null
        let decoded = null
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            token = req.headers.authorization.split(' ')[1]

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_CLIENT) }
            catch (error) {/*throw new Error("1")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DEVELOPER) }
            catch (error) {/*throw new Error("2")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_DELEGATE) }
            catch (error) {/*throw new Error("3")*/ }

            try { decoded = verify(token, process.env.JWT_SECRET_ROLE_ADMIN) }
            catch (error) {/*throw new Error("4")*/ }

            if (!decoded) {
                res.status(401)
                throw new TypeError("Unauthorized, you do not have user access")
            }

            const id = (decoded.mix).split("|")[0]
            const role = (decoded.mix).split("|")[1]

            let user = {}
            switch (role) {
                case "Client": user = await Client.findById(id); break;
                case "Developer": user = await Developer.findById(id); break;
                case "Delegate": user = await Delegate.findById(id); break;
                case "Admin": user = await Admin.findById(id); break;
                default:
                    {
                        res.status(403)
                        throw new TypeError(`Unauthenticated ${role} in the system`)
                    }
            }
            if (!user) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed up " + role.toLowerCase())
            }

            if (user.end_block_date && req.url !== "/sign-out") {
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

            const storedToken = await Token.findOne({ token_value: token })
            if (!storedToken) {
                res.status(403)
                throw new TypeError("Unauthenticated, you are not signed in " + role.toLowerCase())
            }

            if (!(req.params.id == user._id || user.role === "Admin")) {
                if (!(req.params.id == user._id)) {
                    let result = {}
                    let baseUrl = req.baseUrl

                    if (baseUrl === "") {
                        let originalUrl = req.originalUrl
                        baseUrl = "/" + (originalUrl.split("/"))[1] + "/" + (originalUrl.split("/"))[2]
                    }

                    switch (baseUrl) {
                        //Add models whose owner is the user
                        case "/api/supports": result = await Support.findById(req.params.id); break;
                        case "/api/chats": result = await Chat.findById(req.params.id); break;
                        case "/api/posts": result = await Post.findById(req.params.id); break;
                        case "/api/comments": result = await Comment.findById(req.params.id); break;
                        default: result = null
                    }

                    if (result && result.user_id && (result.user_id.toString() !== user._id.toString())) {
                        res.status(401)
                        throw new TypeError("Unauthorized, you do not have right access")
                    }
                    else if (result && result.owner_id && (result.owner_id.toString() !== user._id.toString())) {
                        res.status(401)
                        throw new TypeError("Unauthorized, you do not have right access")
                    }
                    else if (result && result.editor_id && (result.editor_id.toString() !== user._id.toString())) {
                        res.status(401)
                        throw new TypeError("Unauthorized, you do not have right access")
                    }
                }
                else {
                    res.status(401)
                    throw new TypeError("Unauthorized, you do not have right access")
                }
            }

            req.body.middleware_token = storedToken.token_value
            req.body.middleware_role = storedToken.user_role
            req.body.middleware_id = storedToken.user_id
            //Or
            req.middleware_token = storedToken.token_value
            req.middleware_role = storedToken.user_role
            req.middleware_id = storedToken.user_id

            next();
        }
        else {
            res.status(401)
            throw new TypeError("Unauthorized, you do not have user access")
        }
    }
    catch (error) {
        if (error instanceof TypeError) {
            res.json({ message: error.message }) //401,403
        }

        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//For Single Resourse