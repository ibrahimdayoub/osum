import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import { isObjectIdOrHexString } from "mongoose";

import Project from "../models/ProjectModel.js";
import Task from "../models/TaskModel.js";
import Notification from "../models/NotificationModel.js";

//Developer,Delegate
export const addTask = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        let { content, project_id } = req.body
        const data = { content, project_id }
        const rules = {
            content: 'required|string|between:2,500',
            project_id: 'required|string|between:5,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(project_id)) {
            return res.status(400).json({ message: "Project id must be valid id" })
        }
        const project = await Project.findById(project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (project.creator_id !== middleware_id && project.team_id?.leader_id !== middleware_id && project.team_id?.members_ids?.includes(middleware_id)) {
            return res.status(400).json({ message: "You have not access to this operation" })
        }
        const existsTask = await Task.find({ content, project_id })
        if (existsTask.length > 0) {
            return res.status(400).json({ message: "Project has already task with same name" })
        }
        const taskObject = {
            content,
            creator_id: middleware_id,
            creator_model: middleware_role,
            project_id
        }
        let task = await Task.create(taskObject);
        task = await task.populate(["creator_id", { path: "project_id", populate: { path: "team_id" } }]);
        if (task.project_id.team_id) {
            // Create Notification And Notify All Members (Developers)
            const notificationObject = {
                redirect: "tasks",
                message: `There is a new task created, and you added as member in it`,
                senders: [
                    {
                        sender_id: middleware_id,
                        sender_model: middleware_role,
                    }
                ],
                receivers: task.project_id.team_id.members_ids.map((member_id) => {
                    if ((member_id).toString() === (middleware_id).toString()) {
                        return null
                    }
                    return {
                        receiver_id: member_id,
                        receiver_model: "Developer"
                    }
                })
            }
            await Notification.create(notificationObject)
        }
        return res.status(201).json({ task, message: "Task added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Developer,Delegate
export const getTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsTask = await Task.findById(id).populate(["creator_id", "project_id"]);;
        if (!existsTask) {
            return res.status(404).json({ message: "Task is not found" })
        }
        const project = await Project.findById(existsTask.project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (project.creator_id !== middleware_id && project.team_id?.leader_id !== middleware_id && project.team_id?.members_ids?.includes(middleware_id)) {
            return res.status(400).json({ message: "You have not access to this operation" })
        }
        return res.status(200).json({ task: existsTask, message: "Task fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Developer,Delegate
export const updateTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let { content } = req.body
        const data = { content }
        const rules = {
            content: 'required|string|between:2,500',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let existsTask = await Task.findById(id);
        if (!existsTask) {
            return res.status(404).json({ message: "Task is not found" })
        }
        const project = await Project.findById(existsTask.project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (project.creator_id !== middleware_id && project.team_id?.leader_id !== middleware_id && project.team_id?.members_ids?.includes(middleware_id)) {
            return res.status(400).json({ message: "You have not access to this operation" })
        }
        existsTask = await Task.find({ content, project_id: existsTask.project_id })
        if (existsTask.length > 0 && (existsTask[0]._id).toString() !== (id).toString()) {
            return res.status(400).json({ message: "Project has already task with same name" })
        }
        const TaskObject = {
            content
        }
        let task = await Task.findByIdAndUpdate(id, TaskObject, { new: true }).populate(["creator_id", "project_id"]);
        return res.status(200).json({ task, message: "Task updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Developer,Delegate
export const checkTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsTask = await Task.findById(id);
        if (!existsTask) {
            return res.status(404).json({ message: "Task is not found" })
        }
        const project = await Project.findById(existsTask.project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (project.creator_id !== middleware_id && project.team_id?.leader_id !== middleware_id && project.team_id?.members_ids?.includes(middleware_id)) {
            return res.status(400).json({ message: "You have not access to this operation" })
        }
        const TaskObject = {
            is_checked: !existsTask.is_checked
        }
        let task = await Task.findByIdAndUpdate(id, TaskObject, { new: true }).populate(["creator_id", "project_id"]);
        return res.status(200).json({ task, message: task.is_checked ? "Task checked successfully" : "Task unchecked successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Developer,Delegate
export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        let existsTask = await Task.findById(id);
        if (!existsTask) {
            return res.status(404).json({ message: "Task is not found" })
        }
        const project = await Project.findById(existsTask.project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if ((project.creator_id).toString() === (middleware_id).toString() || (project.team_id?.leader_id).toString() === (middleware_id).toString() || project.team_id?.members_ids?.includes(middleware_id) || middleware_role === "Admin") {
            await existsTask.delete()
            return res.status(200).json({ task: existsTask, message: "Task deleted successfully" })
        }
        else {
            return res.status(404).json({ message: "Task is not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Developer,Delegate
export const getTasks = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req
        let { project_id } = req.body
        const data = { project_id };
        const rules = {
            project_id: 'required|string|between:2,100',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (!isObjectIdOrHexString(project_id)) {
            return res.status(400).json({ message: "Project id must be only valid id" })
        }
        const project = await Project.findById(project_id).populate("team_id")
        if (!project) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (project.creator_id !== middleware_id && project.team_id?.leader_id !== middleware_id && project.team_id?.members_ids?.includes(middleware_id)) {
            return res.status(400).json({ message: "You have not access to this operation" })
        }
        const existsTasks = await Task.find({ project_id }).populate(["creator_id", "project_id"]).sort({ createdAt: -1 })
        if (existsTasks.length <= 0) {
            return res.status(404).json({ message: "Tasks are not found" })
        }
        return res.status(200).json({ tasks: existsTasks, message: "Tasks fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Admin
export const getDashboardTasks = asyncHandler(async (req, res) => {
    try {
        const tasks = await Task.find().populate(["creator_id", "project_id"])
        if (tasks.length === 0) {
            return res.status(404).json({ message: "Tasks are not found" })
        }
        return res.status(200).json({ tasks, message: "Tasks fetched successfully" })
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