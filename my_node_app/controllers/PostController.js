import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Client from '../models/ClientModel.js'
import Developer from '../models/DeveloperModel.js'
import Delegate from '../models/DelegateModel.js'
import Post from '../models/PostModel.js'
import Comment from '../models/CommentModel.js'
import Notification from '../models/NotificationModel.js'

//Client,Developer,Delegate
export const addPost = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        let { content, field_of_work, key_words } = req.body
        const post_picture = req.file ? req.file.path : null
        if (post_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        key_words = String(key_words).split(',') //Because it is string from (form data)
        const data = { content, field_of_work, key_words, post_picture };
        const rules = {
            content: 'required|string|between:2,500',
            field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
            key_words: 'required|array|between:1,10',
            post_picture: 'string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const dataObject = {
            editor_id: middleware_id,
            editor_model: middleware_role,
            content,
            field_of_work,
            key_words,
            post_picture
        }
        let post = await Post.create(dataObject)
        post = await post.populate("editor_id")
        //Create Notification And Notify All Interested Users (User Field Equales Post Field)
        let users = []
        const clients = await Client.find({ field_of_work: post.field_of_work })
        users.push(...clients)
        const developers = await Developer.find({ field_of_work: post.field_of_work })
        users.push(...developers)
        const delegates = await Delegate.find({ field_of_work: post.field_of_work })
        users.push(...delegates)
        const notificationObject = {
            redirect: "home",
            message: `There is an ${(middleware_role).toLowerCase()} published post, go to home and check it`,
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: users.map((user) => {
                if ((user._id).toString() !== (middleware_id).toString()) {
                    return {
                        receiver_id: user._id,
                        receiver_model: user.role
                    }
                }
            })
        }
        await Notification.create(notificationObject)
        return res.status(201).json({ post, message: "Post added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,401,403,500

//Client,Developer,Delegate
export const getPost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsPost = await Post.findById(id).populate(["editor_id", "comments"])
        if (!existsPost) {
            return res.status(404).json({ message: "Post is not found" })
        }
        return res.status(200).json({ post: existsPost, message: "Post fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const updatePost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        let { content, field_of_work, key_words } = req.body
        const post_picture = req.file ? req.file.path : null
        console.log({ content, field_of_work, key_words, post_picture })
        if (post_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        key_words = String(key_words).split(',') //Because it is string from (form data)
        const data = { content, field_of_work, key_words, post_picture };
        const rules = {
            content: 'required|string|between:2,500',
            field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
            key_words: 'required|array|between:1,10',
            post_picture: 'string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsPost = await Post.findById(id)
        if (!existsPost) {
            return res.status(404).json({ message: "Post is not found" })
        }
        let dataObject = {}
        if (post_picture) {
            dataObject = {
                content,
                field_of_work,
                key_words,
                post_picture
            }
        }
        else {
            dataObject = {
                content,
                field_of_work,
                key_words,
            }
        }
        const post = await Post.findByIdAndUpdate(id, dataObject, { new: true }).populate(["editor_id", "comments"])
        return res.status(200).json({ post, message: "Post updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const deletePost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsPost = await Post.findByIdAndDelete(id)
        if (!existsPost) {
            return res.status(404).json({ message: "Post is not found" })
        }
        await Comment.deleteMany({ post_id: id });
        return res.status(200).json({ post: existsPost, message: "Post deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const getPosts = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id, location, target_id } = req.body
        const data = { location };
        const rules = {
            location: 'required|string|between:1,50|in:my_profile,target_profile,home',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (location === "my_profile") {
            const existsPosts = await Post.find({ editor_id: middleware_id }).populate(["editor_id", "comments"]).sort({ createdAt: -1 })
            if (existsPosts.length <= 0) {
                return res.status(404).json({ message: "Posts are not found" })
            }
            return res.status(200).json({ posts: existsPosts, message: "Posts fetched successfully" })
        }
        else if (location === "target_profile") {
            const data = { target_id };
            const rules = {
                target_id: 'required|string|between:2,100',
            };
            const validation = new Validator(data, rules);
            if (validation.fails()) {
                const errors = oneFieldResult(validation.errors.errors)
                return res.status(400).json({ errors, message: "Some fields are required or not validated" })
            }
            if (!isObjectIdOrHexString(target_id)) {
                return res.status(400).json({ message: "Target id must be only valid id" })
            }
            const existsPosts = await Post.find({ editor_id: target_id }).populate(["editor_id", "comments"]).sort({ createdAt: -1 })
            if (existsPosts.length <= 0) {
                return res.status(404).json({ message: "Posts are not found" })
            }
            return res.status(200).json({ posts: existsPosts, message: "Posts fetched successfully" })
        }
        else if (location === "home") {
            // Top
            let existsPostsUp = []
            const myPosts = await Post.find({ editor_id: middleware_id }).populate(["editor_id", "comments"]).sort({ createdAt: -1 })
            const allPosts = await Post.find({ editor_id: { $ne: middleware_id } }).populate(["editor_id", "comments"]).sort({ createdAt: -1 })
            const cosineSimilarity = (vectorA, vectorB) => {
                const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
                const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
                const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));
                return dotProduct / (magnitudeA * magnitudeB);
            }
            const calculateTFIDFVector = (words, vocabulary) => {
                const vector = [];
                for (const term of vocabulary) {
                    vector.push(words.includes(term) ? 1 : 0);
                }
                return vector;
            }
            myPosts.map((myPost) => {
                allPosts.map((allPost) => {
                    const sentence1 = myPost.key_words.join(" ")
                    const sentence2 = allPost.key_words.join(" ")
                    const words1 = sentence1.toLowerCase().split(' ')
                    const words2 = sentence2.toLowerCase().split(' ')
                    const vocabulary = Array.from(new Set([...words1, ...words2]))
                    const tfidfVector1 = calculateTFIDFVector(words1, vocabulary)
                    const tfidfVector2 = calculateTFIDFVector(words2, vocabulary)
                    const similarity = cosineSimilarity(tfidfVector1, tfidfVector2)
                    if (similarity > 0.3) {
                        existsPostsUp.push(allPost)
                    }
                })
            })
            //Down
            let user = {}
            switch (middleware_role) {
                case "Client": user = await Client.findById(middleware_id); break;
                case "Developer": user = await Developer.findById(middleware_id); break;
                case "Delegate": user = await Delegate.findById(middleware_id); break;
                default:
                    {
                        return res.status(400).json({
                            message: `${role} it's undefined role in the system`
                        })
                    }
            }
            const findOr = {
                $or: [
                    { editor_id: middleware_id },
                    { field_of_work: user.field_of_work }
                ],
            }
            const existsPostsDown = await Post.find(findOr).populate(["editor_id", "comments"]).sort({ createdAt: -1 }).limit(50)
            //All
            let existsPosts = [...existsPostsUp, ...existsPostsDown]
            const uniqueIds = {};
            existsPosts = existsPosts.filter((post) => {
                if (!uniqueIds[post.id]) {
                    uniqueIds[post.id] = true;
                    return true;
                }
                return false;
            })
            existsPosts = existsPosts.filter((post) => {
                return !post.likes.includes(middleware_id)
            })
            existsPosts = existsPosts.filter((post) => {
                return post.comments.map((comment) => {
                    if ((comment.editor_id).toString() !== (middleware_id).toString()) {
                        return true
                    }
                    return false
                })
            })
            if (existsPosts.length <= 0) {
                return res.status(404).json({ message: "Posts are not found" })
            }
            return res.status(200).json({ posts: existsPosts, message: "Posts fetched successfully" })
        }
        else {
            return res.status(404).json({ message: "Posts are not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const likePost = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsPost = await Post.findById(id)
        if (!existsPost) {
            return res.status(404).json({ message: "Post is not found" })
        }
        if (existsPost.likes.includes(middleware_id)) {
            const post = await Post.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["editor_id", "comments"]);
            return res.status(200).json({ post, message: "Post disliked successfully" })
        }
        else {
            const post = await Post.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["editor_id", "comments"]);
            if ((post.editor_id._id).toString() !== (middleware_id).toString()) {
                console.log((post.editor_id._id).toString(), (middleware_id).toString())
                // Create Notification And Notify Only User
                const notificationObject = {
                    redirect: `profile/${post.editor_id._id}`,
                    message: `There is a ${middleware_role} likes your post, go to your profile and check it`,
                    senders: [
                        {
                            sender_id: middleware_id,
                            sender_model: middleware_role,
                        }
                    ],
                    receivers: [
                        {
                            receiver_id: post.editor_id._id,
                            receiver_model: post.editor_model
                        }
                    ]
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ post, message: "Post liked successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const searchPosts = asyncHandler(async (req, res) => {
    try {
        const key = req.query.key
            ? {
                $or: [
                    { content: { $regex: req.query.key, $options: "i" } },
                    { key_words: { $elemMatch: { $regex: req.query.key, $options: "i" } } }
                ]
            }
            : {}
        const posts = await Post.find(key).populate(["editor_id", "comments"]).sort({ createdAt: -1 })
        if (posts.length === 0) {
            return res.status(404).json({ message: "Posts are not found" })
        }
        return res.status(200).json({ posts, message: "Posts fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin
export const getDashboardPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find().populate(["editor_id"])
        if (posts.length === 0) {
            return res.status(404).json({ message: "Posts are not found" })
        }
        return res.status(200).json({ posts, message: "Posts fetched successfully" })
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