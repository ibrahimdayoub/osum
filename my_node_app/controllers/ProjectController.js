import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import { isObjectIdOrHexString } from "mongoose";

import Client from "../models/ClientModel.js";
import Project from "../models/ProjectModel.js";
import Team from "../models/TeamModel.js";
import Notification from "../models/NotificationModel.js";

//Developer,Delegate
export const addProject = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        let { project_name, project_description, team_id, client_id, expected_duration, total_coast, discount_per_day, github_link } = req.body
        const data = { project_name, project_description, team_id, client_id, expected_duration, total_coast, discount_per_day, github_link }
        let rules = {}
        if (client_id || total_coast || discount_per_day) {
            rules = {
                project_name: 'required|string|between:2,50',
                project_description: 'required|string|between:2,250',
                team_id: 'string|between:5,100',
                expected_duration: 'required|integer|min:0',
                github_link: `required|regex:https:\/\/github\.com\/`,
                client_id: 'required|string|between:5,100',
                total_coast: 'required|integer|min:0',
                discount_per_day: 'required|integer|min:0',
            };
        }
        else {
            rules = {
                project_name: 'required|string|between:2,50',
                project_description: 'required|string|between:2,250',
                team_id: 'string|between:5,100',
                expected_duration: 'required|integer|min:0',
                github_link: `required|regex:https:\/\/github\.com\/`,
            };
        }
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsProject = await Project.find({ project_name: project_name, creator_id: middleware_id })
        if (existsProject.length > 0) {
            return res.status(400).json({ message: "You have already project with same name" })
        }
        if (team_id) {
            if (!isObjectIdOrHexString(team_id)) {
                return res.status(400).json({ message: "Team id must be valid id" })
            }
            const team = await Team.findById(team_id)
            if (!team) {
                return res.status(404).json({ message: "Team is not found" })
            }
        }
        if (client_id) {
            if (!isObjectIdOrHexString(client_id)) {
                return res.status(400).json({ message: "Client id must be valid id" })
            }
            const client = await Client.findById(client_id)
            if (!client) {
                return res.status(404).json({ message: "Client is not found" })
            }
        }
        const ProjectObject = {
            project_name,
            project_description,
            creator_id: middleware_id,
            creator_model: middleware_role,
            team_id: team_id ? team_id : null,
            client_id: client_id ? client_id : null,
            end_date: new Date(new Date().getTime() + (expected_duration * 24 * 60 * 60 * 1000)),
            total_coast: total_coast ? total_coast : 0,
            discount_per_day: discount_per_day ? discount_per_day : 0,
            github_link
        }
        let project = await Project.create(ProjectObject);
        project = await project.populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"])
        if (project.team_id) {
            //Create Notification And Notify All Members (Developers And Client)
            const notificationObject = {
                redirect: "teams",
                message: `There is a new project created, and you added as member in it`,
                senders: [
                    {
                        sender_id: middleware_id,
                        sender_model: middleware_role,
                    }
                ],
                receivers: [
                    ...project.team_id.members_ids.map((member_id) => {
                        return {
                            receiver_id: member_id,
                            receiver_model: "Developer"
                        }
                    }),
                    client_id ?
                        {
                            receiver_id: client_id ? client_id : null,
                            receiver_model: "Client"
                        } :
                        null
                ]
            }
            await Notification.create(notificationObject)
        }
        return res.status(201).json({ project, message: "Project added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,404,500

//Developer,Delegate
export const getProject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsProject = await Project.findById(id).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]);
        if (!existsProject || (existsProject.creator_id.id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Project is not found" })
        }
        return res.status(200).json({ project: existsProject, message: "Project fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Developer,Delegate
export const updateProject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let { project_name, project_description, github_link } = req.body
        const data = { project_name, project_description, github_link }
        const rules = {
            project_name: 'required|string|between:2,50',
            project_description: 'required|string|between:2,250',
            github_link: `required|regex:https:\/\/github\.com\/`,
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let existsProject = await Project.findById(id);
        if (!existsProject || (existsProject.creator_id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Team is not found" })
        }
        existsProject = await Project.find({ project_name: project_name, creator_id: middleware_id })
        if (existsProject.length > 0 && (existsProject[0]._id).toString() !== (id).toString()) {
            return res.status(400).json({ message: "You have already project with same name" })
        }
        const ProjectObject = {
            project_name,
            project_description,
            github_link
        }
        let project = await Project.findByIdAndUpdate(id, ProjectObject, { new: true });
        project = await project.populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"])
        return res.status(200).json({ project, message: "Project updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,404,500

//Developer,Delegate,Client
export const getProjects = asyncHandler(async (req, res) => {
    try {
        const { middleware_id, location, target_id, team_id } = req.body
        const data = { location };
        const rules = {
            location: 'required|string|between:1,50|in:my_profile,target_profile,team,tasks',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (location === "my_profile" || location === "tasks") {
            const findOrPersonal = {
                $or: [
                    { creator_id: middleware_id, is_personal: true },
                    { client_id: middleware_id }
                ],
            }
            const existsPersonalProjects = await Project.find(findOrPersonal).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
            const findOrCollaborative = {
                $or: [
                    { leader_id: middleware_id },
                    { members_ids: { $elemMatch: { $eq: middleware_id } } }
                ],
            }
            const existsTeams = await Team.find(findOrCollaborative)
            let existsCollaborativeProjects = []
            for (let i = 0; i < existsTeams.length; i++) {
                let teamProjects = await Project.find({ team_id: existsTeams[i]._id }).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
                if (teamProjects.length > 0) {
                    existsCollaborativeProjects.push(...teamProjects)
                }
            }
            if (existsPersonalProjects.length + existsCollaborativeProjects.length <= 0) {
                return res.status(404).json({ message: "Projects are not found" })
            }
            let existsProjects = [...existsPersonalProjects, ...existsCollaborativeProjects]
            return res.status(200).json({ projects: existsProjects, message: "Projects fetched successfully" })
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
            const findOrPersonal = {
                $or: [
                    { creator_id: target_id, is_personal: true },
                    { client_id: target_id }
                ],
            }
            const existsPersonalProjects = await Project.find(findOrPersonal).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
            const findOrCollaborative = {
                $or: [
                    { leader_id: target_id },
                    { members_ids: { $elemMatch: { $eq: target_id } } }
                ],
            }
            const existsTeams = await Team.find(findOrCollaborative)
            let existsCollaborativeProjects = []
            for (let i = 0; i < existsTeams.length; i++) {
                let teamProjects = await Project.find({ team_id: existsTeams[i]._id }).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
                if (teamProjects.length > 0) {
                    existsCollaborativeProjects.push(...teamProjects)
                }
            }
            if (existsPersonalProjects.length + existsCollaborativeProjects.length <= 0) {
                return res.status(404).json({ message: "Projects are not found" })
            }
            let existsProjects = [...existsPersonalProjects, ...existsCollaborativeProjects]
            return res.status(200).json({ projects: existsProjects, message: "Projects fetched successfully" })
        }
        else if (location === "team") {
            const data = { team_id };
            const rules = {
                team_id: 'required|string|between:2,100',
            };
            const validation = new Validator(data, rules);
            if (validation.fails()) {
                const errors = oneFieldResult(validation.errors.errors)
                return res.status(400).json({ errors, message: "Some fields are required or not validated" })
            }
            if (!isObjectIdOrHexString(team_id)) {
                return res.status(400).json({ message: "Team id must be only valid id" })
            }
            const existsProjects = await Project.find({ team_id }).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
            if (existsProjects.length <= 0) {
                return res.status(404).json({ message: "Projects are not found" })
            }
            return res.status(200).json({ projects: existsProjects, message: "Projects fetched successfully" })
        }
        else {
            return res.status(404).json({ message: "Projects are not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Developer,Delegate,Client
export const completeProject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsProject = await Project.findById(id);
        let ProjectObject = {}
        let message = ""
        if (!existsProject) {
            return res.status(404).json({ message: "Project is not found" })
        }
        else if ((existsProject.creator_id).toString() === (middleware_id).toString()) {
            if (existsProject.status === "Retreated Developers") {
                return res.status(400).json({ message: "You can't complete project after retreating developers" })
            }
            else if (existsProject.status === "Retreated Clients") {
                return res.status(400).json({ message: "You can't complete project after retreating clients" })
            }
            else if (existsProject.status === "Completed Payment") {
                return res.status(400).json({ message: "You can't complete project after completing payment" })
            }
            ProjectObject = {
                status: existsProject.status === "Completed Project" ? "Started Project" : "Completed Project"
            }
            message = existsProject.status === "Completed Project" ? "Project started successfully" : "Project completed successfully"
        }
        else if ((existsProject.client_id).toString() === (middleware_id).toString()) {
            if (existsProject.status !== "Completed Project") {
                return res.status(400).json({ message: "You can't complete payment before completing project" })
            }
            ProjectObject = {
                status: "Completed Payment"
            }
            message = "Payment completed successfully"
        }
        else {
            return res.status(404).json({ message: "Project is not found" })
        }
        let project = await Project.findByIdAndUpdate(id, ProjectObject, { new: true });
        project = await project.populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"])
        return res.status(200).json({ project, message })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,500

//Developer,Delegate,Client
export const retreatProject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsProject = await Project.findById(id);
        let ProjectObject = {}
        let message = ""
        if (!existsProject) {
            return res.status(404).json({ message: "Team is not found" })
        }
        else if ((existsProject.creator_id).toString() === (middleware_id).toString()) {
            if (existsProject.status === "Completed Payment") {
                return res.status(400).json({ message: "You can't retreate project after completing payment" })
            }
            ProjectObject = {
                status: existsProject.status === "Retreated Developers" ? "Started Project" : "Retreated Developers"
            }
            message = existsProject.status === "Retreated Developers" ? "Project started successfully" : "Developers Retreated successfully"
        }
        else if ((existsProject.client_id).toString() === (middleware_id).toString()) {
            if (existsProject.status === "Completed Payment") {
                return res.status(400).json({ message: "You can't retreate project after completing payment" })
            }
            ProjectObject = {
                status: existsProject.status === "Retreated Clients" ? "Started Project" : "Retreated Clients"
            }
            message = existsProject.status === "Retreated Clients" ? "Project started successfully" : "Clients Retreated successfully"
        }
        else {
            return res.status(404).json({ message: "Team is not found" })
        }
        let project = await Project.findByIdAndUpdate(id, ProjectObject, { new: true });
        project = await project.populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"])
        return res.status(200).json({ project, message })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,400,401,403,404,500

//Developer,Delegate,Client
export const likeProject = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsProject = await Project.findById(id)
        if (!existsProject) {
            return res.status(404).json({ message: "Project is not found" })
        }
        if (existsProject.likes.includes(middleware_id)) {
            const project = await Project.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]);
            return res.status(200).json({ project, message: "Project disliked successfully" })
        }
        else {
            const project = await Project.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]);
            if ((project.creator_id._id).toString() !== (middleware_id).toString()) {
                // Create Notification And Notify All Members (Developers And Client)
                let notificationObject = {}
                if (project.team_id) {
                    notificationObject = {
                        redirect: "teams",
                        message: `There is a ${middleware_role} likes your project, go to your teams and check it`,
                        senders: [
                            {
                                sender_id: middleware_id,
                                sender_model: middleware_role,
                            }
                        ],
                        receivers: [
                            ...project.team_id.members_ids.map((member_id) => {
                                return {
                                    receiver_id: member_id,
                                    receiver_model: "Developer"
                                }
                            }),
                            project.client_id ?
                                {
                                    receiver_id: project.client_id ? project.client_id : null,
                                    receiver_model: "Client"
                                } :
                                null,
                            {
                                receiver_id: project.creator_id._id,
                                receiver_model: project.creator_id.role
                            }
                        ]
                    }
                }
                else {
                    notificationObject = {
                        redirect: `profile/${project.creator_id._id}`,
                        message: `There is a ${middleware_role} likes your project, go to your profile and check it`,
                        senders: [
                            {
                                sender_id: middleware_id,
                                sender_model: middleware_role,
                            }
                        ],
                        receivers: [
                            {
                                receiver_id: project.creator_id._id,
                                receiver_model: project.creator_id.role
                            }
                        ]
                    }
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ project, message: "Project liked successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const searchProjects = asyncHandler(async (req, res) => {
    try {
        const key = req.query.key
            ? {
                $or: [
                    { project_name: { $regex: req.query.key, $options: "i" } },
                    { project_description: { $regex: req.query.key, $options: "i" } }
                ]
            }
            : {}
        const projects = await Project.find(key).populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"]).sort({ createdAt: -1 })
        if (projects.length === 0) {
            return res.status(404).json({ message: "Projects are not found" })
        }
        return res.status(200).json({ projects, message: "Projects fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin
export const getDashboardProjects = asyncHandler(async (req, res) => {
    try {
        const projects = await Project.find().populate(["creator_id", { path: "team_id", populate: { path: "company_id" } }, "client_id"])
        if (projects.length === 0) {
            return res.status(404).json({ message: "Projects are not found" })
        }
        return res.status(200).json({ projects, message: "Projects fetched successfully" })
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