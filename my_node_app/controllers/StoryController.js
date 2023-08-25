import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Story from '../models/StoryModel.js'
import Notification from '../models/NotificationModel.js'

//Client,Developer,Delegate
export const addStory = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        const story_picture = req.file ? req.file.path : null
        if (story_picture) {
            const extname = path.extname(req.file.originalname);
            if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
                return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
            }
        }
        const data = { story_picture };
        const rules = {
            story_picture: 'required|string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        // Every Day we give you one story only.
        let stories = await Story.find({ editor_id: middleware_id }).sort({ createdAt: -1 })
        if (stories.length > 0) {
            let latestStory = stories[0]
            let date1 = (latestStory.createdAt).valueOf()
            let date2 = (new Date()).valueOf()
            let dateDiffInDays = Math.floor((date2 - date1) / 1000 / 60 / 60 / 24)
            if (dateDiffInDays === 0) {
                return res.status(400).json({ message: "You have to wait one day to add new story" })
            }
        }
        const dataObject = {
            editor_id: middleware_id,
            editor_model: middleware_role,
            story_picture
        }
        let story = await Story.create(dataObject)
        story = await story.populate("editor_id")
        //Create Notification And Notify All Followers Users (He Follows Me If Rate Me Between Four And Seven)
        const notificationObject = {
            redirect: "home",
            message: `There is an ${(middleware_role).toLowerCase()} published story, go to home and check it`,
            senders: [
                {
                    sender_id: middleware_id,
                    sender_model: middleware_role,
                }
            ],
            receivers: story.editor_id.rate_personal_profile.map((rateObject) => {
                if (rateObject.rate > 3) {
                    return {
                        receiver_id: rateObject.rater_id,
                        receiver_model: rateObject.rater_model
                    }
                }
            })
        }
        await Notification.create(notificationObject)
        return res.status(201).json({ story, message: "Story added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 201,400,401,403,500

//Client,Developer,Delegate
export const getStory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const existsStory = await Story.findById(id).populate(["editor_id"])
        if (!existsStory) {
            return res.status(404).json({ message: "Story is not found" })
        }
        return res.status(200).json({ story: existsStory, message: "Story fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const deleteStory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        const existsStory = await Story.findByIdAndDelete(id)
        if (!existsStory || (existsStory.editor_id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Story is not found" })
        }
        return res.status(200).json({ story: existsStory, message: "Story deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const getStories = asyncHandler(async (req, res) => {
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
            const existsStories = await Story.find({ editor_id: middleware_id }).populate(["editor_id"]).sort({ createdAt: -1 })
            if (existsStories.length <= 0) {
                return res.status(404).json({ message: "Stories are not found" })
            }
            return res.status(200).json({ stories: existsStories, message: "Stories fetched successfully" })
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
            const existsStories = await Story.find({ editor_id: target_id }).populate(["editor_id"]).sort({ createdAt: -1 })
            if (existsStories.length <= 0) {
                return res.status(404).json({ message: "Stories are not found" })
            }
            return res.status(200).json({ stories: existsStories, message: "Stories fetched successfully" })
        }
        else if (location === "home") {
            const existsStories = await Story.find().populate(["editor_id"]).sort({ createdAt: -1 })
            let existsStoriesAlt = []
            for (let i = 0; i < existsStories.length; i++) {
                let date1 = (existsStories[i].createdAt).valueOf()
                let date2 = (new Date()).valueOf()
                let dateDiffInDays = Math.floor((date2 - date1) / 1000 / 60 / 60 / 24)
                if (dateDiffInDays !== 0) {
                    continue;
                }
                if ((existsStories[i].editor_id._id).toString() === (middleware_id).toString()) {
                    existsStoriesAlt.push(existsStories[i]);
                    continue;
                }
                for (let j = 0; j < existsStories[i].editor_id.rate_personal_profile.length; j++) {
                    if ((existsStories[i].editor_id.rate_personal_profile[j].rater_id).toString() === (middleware_id).toString() && existsStories[i].editor_id.rate_personal_profile[j].rate > 3) {
                        existsStoriesAlt.push(existsStories[i]);
                        break;
                    }
                }
            }
            if (existsStoriesAlt.length === 0) {
                return res.status(404).json({ message: "Stories are not found" })
            }
            return res.status(200).json({ stories: existsStoriesAlt, message: "Stories fetched successfully" })
        }
        else {
            return res.status(404).json({ message: "Stories are not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const likeStory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsStory = await Story.findById(id)
        if (!existsStory) {
            return res.status(404).json({ message: "Story is not found" })
        }
        if (existsStory.likes.includes(middleware_id)) {
            const story = await Story.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["editor_id"]);
            return res.status(200).json({ story, message: "Story disliked successfully" })
        }
        else {
            const story = await Story.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["editor_id"]);
            if ((story.editor_id._id).toString() !== (middleware_id).toString()) {
                // Create Notification And Notify Only User
                const notificationObject = {
                    redirect: `profile/${story.editor_id._id}`,
                    message: `There is a ${middleware_role} likes your story, go to your profile and check it`,
                    senders: [
                        {
                            sender_id: middleware_id,
                            sender_model: middleware_role,
                        }
                    ],
                    receivers: [
                        {
                            receiver_id: story.editor_id._id,
                            receiver_model: story.editor_id.role,
                        }
                    ]
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ story, message: "Story liked successfully" })
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