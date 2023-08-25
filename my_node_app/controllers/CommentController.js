import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Comment from '../models/CommentModel.js'
import Post from "../models/PostModel.js";
import Notification from "../models/NotificationModel.js";

//Client,Developer,Delegate
export const addComment = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        const { content, post_id } = req.body
        const comment_picture = req.file ? req.file.path : null
        if (comment_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { content, post_id, comment_picture };
        const rules = {
            content: 'required|string|between:2,200',
            post_id: 'required|string|between:1,50',
            comment_picture: 'string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(post_id)) {
            return res.status(400).json({ message: "Post id must be only valid id" })
        }
        if (!await Post.findById(post_id)) {
            return res.status(404).json({ message: "Post is not found" })
        }
        let dataObject = {
            editor_id: middleware_id,
            editor_model: middleware_role,
            content,
            post_id,
            comment_picture
        }
        let comment = await Comment.create(dataObject)
        comment = await comment.populate(["editor_id", "post_id"])
        await Post.findByIdAndUpdate(post_id, { $push: { comments: comment._id } })
        if ((comment.post_id.editor_id).toString() !== (middleware_id).toString()) {
            // Create Notification And Notify Only User
            const notificationObject = {
                redirect: `profile/${comment.post_id.editor_id}`,
                message: `There is a ${middleware_role} comment your post, go to your profile and check it`,
                senders: [
                    {
                        sender_id: middleware_id,
                        sender_model: middleware_role,
                    }
                ],
                receivers: [
                    {
                        receiver_id: comment.post_id.editor_id,
                        receiver_model: comment.post_id.editor_model
                    }
                ]
            }
            await Notification.create(notificationObject)
        }
        return res.status(201).json({ comment, message: "Comment added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,401,403,404,500

//Client,Developer,Delegate
export const getComment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsComment = await Comment.findById(id).populate('editor_id')
        if (!existsComment) {
            return res.status(404).json({ message: "Comment is not found" })
        }
        return res.status(200).json({ comment: existsComment, message: "Comment fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const updateComment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { content } = req.body
        const comment_picture = req.file ? req.file.path : null
        if (comment_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { content, comment_picture };
        const rules = {
            content: 'required|string|between:2,200',
            comment_picture: 'string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsComment = await Comment.findById(id)
        if (!existsComment) {
            return res.status(404).json({ message: "Comment is not found" })
        }
        let dataObject = {}
        if (comment_picture) {
            dataObject = {
                content,
                comment_picture
            }
        }
        else {
            dataObject = {
                content
            }
        }
        const comment = await Comment.findByIdAndUpdate(id, dataObject, { new: true }).populate("editor_id")
        return res.status(200).json({ comment, message: "Comment updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsComment = await Comment.findByIdAndDelete(id)
        if (!existsComment) {
            return res.status(404).json({ message: "Comment is not found" })
        }
        await Post.findByIdAndUpdate(existsComment.post_id, { $pull: { comments: existsComment._id } });
        return res.status(200).json({ comment: existsComment, message: "Comment deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const getComments = asyncHandler(async (req, res) => {
    try {
        const { post_id } = req.body
        const data = { post_id };
        const rules = {
            post_id: 'required|string|between:1,50',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(post_id)) {
            return res.status(400).json({ message: "Post id must be only valid id" })
        }
        if (!await Post.findById(post_id)) {
            return res.status(404).json({ message: "Post is not found" })
        }
        let existsComments = await Comment.find({ post_id }).populate("editor_id").sort({ createdAt: -1 })
        if (existsComments.length <= 0) {
            return res.status(404).json({ message: "Comments are not found" })
        }
        return res.status(200).json({ comments: existsComments, message: "Comments fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const likeComment = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsComment = await Comment.findById(id)
        if (!existsComment) {
            return res.status(404).json({ message: "Comment is not found" })
        }
        if (existsComment.likes.includes(middleware_id)) {
            const comment = await Comment.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["editor_id"]);
            return res.status(200).json({ comment, message: "Comment disliked successfully" })
        }
        else {
            const comment = await Comment.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["editor_id"]);
            if ((comment.editor_id._id).toString() !== (middleware_id).toString()) {
                // Create Notification And Notify Only User
                const notificationObject = {
                    redirect: `profile/${comment.editor_id._id}`,
                    message: `There is a ${middleware_role} likes your comment, go to your profile and check it`,
                    senders: [
                        {
                            sender_id: middleware_id,
                            sender_model: middleware_role,
                        }
                    ],
                    receivers: [
                        {
                            receiver_id: comment.editor_id._id,
                            receiver_model: comment.editor_model
                        }
                    ]
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ comment, message: "Comment liked successfully" })
        }
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