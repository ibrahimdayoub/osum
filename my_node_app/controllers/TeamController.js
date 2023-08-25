import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import path from "path"
import { isObjectIdOrHexString } from "mongoose";

import Company from "../models/CompanyModel.js";
import Team from "../models/TeamModel.js";
import Notification from "../models/NotificationModel.js";

//Developer, Delegate (With Add Notification)
export const addTeam = asyncHandler(async (req, res) => {
  try {
    const { middleware_role, middleware_id } = req
    let { team_name, team_description, members_ids, field_of_work, company_id } = req.body
    const team_picture = req.file ? req.file.path : null
    if (team_picture) {
      const extname = path.extname(req.file.originalname);
      if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
        return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
      }
    }
    members_ids = String(members_ids).split(',') //Because it is string from (form data)
    const data = { team_name, team_description, members_ids, field_of_work, team_picture }
    const rules = {
      team_name: 'required|string|between:2,50',
      team_description: 'required|string|between:2,250',
      members_ids: 'required|array|between:1,10',
      field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
      team_picture: 'string|between:2,100',
      company_id: 'string|between:5,100',
    };
    const validation = new Validator(data, rules);
    if (validation.fails()) {
      const errors = oneFieldResult(validation.errors.errors)
      return res.status(400).json({ errors, message: "Some fields are required or not validated" })
    }
    for (let i in members_ids) {
      if (!isObjectIdOrHexString(members_ids[i])) {
        return res.status(400).json({ message: "Memmbers ids must contains only valid ids" })
      }
    }
    if (company_id !== "undefined") //Form Data Issue
    {
      if (company_id && !isObjectIdOrHexString(company_id)) {
        return res.status(400).json({ message: "Company id must be valid id" })
      }
      const company = await Company.findById(company_id)
      if (company_id && !company) {
        return res.status(404).json({ message: "Company is not found" })
      }
    }
    const existsTeam = await Team.find({ team_name: team_name, leader_id: middleware_id })
    if (existsTeam.length > 0) {
      return res.status(400).json({ message: "You have already team with same name" })
    }
    const TeamObject = {
      team_name,
      team_description,
      members_ids,
      leader_id: middleware_id,
      leader_model: middleware_role,
      field_of_work,
      team_picture,
      company_id: company_id !== "undefined" ? company_id : null,
    }
    let team = await Team.create(TeamObject);
    team = await team.populate(["members_ids", "leader_id", "company_id"])
    //Create Notification And Notify All Members (Developers)
    const notificationObject = {
      redirect: "teams",
      message: `There is a new team created, and you added as member in it`,
      senders: [
        {
          sender_id: middleware_id,
          sender_model: middleware_role,
        }
      ],
      receivers: team.members_ids.map((member_id) => {
        return {
          receiver_id: member_id._id,
          receiver_model: "Developer"
        }
      })
    }
    await Notification.create(notificationObject)
    return res.status(201).json({ team, message: "Team added successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 201,400,401,403,500

//Developer, Delegate
export const getTeam = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { middleware_id } = req
    let existsTeam = await Team.findById(id).populate(["members_ids", "leader_id", "company_id"]);
    if (!existsTeam || (existsTeam.leader_id.id).toString() !== (middleware_id).toString()) {
      return res.status(404).json({ message: "Team is not found" })
    }
    return res.status(200).json({ team: existsTeam, message: "Team fetched successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 200,401,403,404,500

//Developer, Delegate
export const updateTeam = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { middleware_id } = req
    let { team_name, team_description, members_ids, field_of_work } = req.body
    const team_picture = req.file ? req.file.path : null
    if (team_picture) {
      const extname = path.extname(req.file.originalname);
      if (extname !== '.png' && extname !== '.jpg' && extname !== '.jpeg') {
        return res.status(400).json({ message: "We accept only images (png, jpg, jpeg)" })
      }
    }
    members_ids = String(members_ids).split(',') //Because it is string from (form data)
    const data = { team_name, team_description, members_ids, field_of_work, team_picture }
    const rules = {
      team_name: 'required|string|between:2,50',
      team_description: 'required|string|between:2,250',
      members_ids: 'required|array|between:1,100',
      field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
      team_picture: 'string|between:2,100'
    };
    const validation = new Validator(data, rules);
    if (validation.fails()) {
      const errors = oneFieldResult(validation.errors.errors)
      return res.status(400).json({ errors, message: "Some fields are required or not validated" })
    }
    for (let i in members_ids) {
      if (!isObjectIdOrHexString(members_ids[i])) {
        return res.status(400).json({ message: "Memmbers ids must contains only valid ids" })
      }
    }

    let existsTeam = await Team.findById(id);
    if (!existsTeam || (existsTeam.leader_id).toString() !== (middleware_id).toString()) {
      return res.status(404).json({ message: "Team is not found" })
    }
    existsTeam = await Team.find({ team_name: team_name, leader_id: middleware_id })
    if (existsTeam.length > 0 && (existsTeam[0]._id).toString() !== (id).toString()) {
      return res.status(400).json({ message: "You have already Team team with same name" })
    }
    let TeamObject = {}
    if (team_picture) {
      TeamObject = {
        team_name: team_name,
        team_description: team_description,
        members_ids: members_ids,
        field_of_work: field_of_work,
        team_picture: team_picture,
      }
    }
    else {
      TeamObject = {
        team_name: team_name,
        team_description: team_description,
        members_ids: members_ids,
        field_of_work: field_of_work
      }
    }
    let team = await Team.findByIdAndUpdate(id, TeamObject, { new: true });
    team = await team.populate(["members_ids", "leader_id", "company_id"])
    return res.status(200).json({ team, message: "Team updated successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 201,400,401,403,404,500

//Developer, Delegate
export const deleteTeam = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const { middleware_id, middleware_role } = req
    let existsTeam = await Team.findById(id);
    if (existsTeam && ((existsTeam.leader_id).toString() === (middleware_id).toString() || middleware_role === "Admin")) {
      await existsTeam.delete()
      return res.status(200).json({ team: existsTeam, message: "Team deleted successfully" })
    } 
    else {
      return res.status(404).json({ message: "Team is not found" })
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 200,401,403,404,500

//Developer, Delegate
export const getTeams = asyncHandler(async (req, res) => {
  try {
    const { middleware_id } = req.body
    const findOr = {
      $or: [
        { leader_id: middleware_id },
        { members_ids: { $elemMatch: { $eq: middleware_id } } }
      ],
    }
    const existsTeams = await Team.find(findOr).populate(["members_ids", "leader_id", "company_id"]).sort({ createdAt: -1 })
    if (existsTeams.length <= 0) {
      return res.status(404).json({ message: "Teams are not found" })
    }
    return res.status(200).json({ teams: existsTeams, message: "Teams fetched successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 200,401,403,404,500

//Developer
export const leaveTeam = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params
    const member_id = req.middleware_id
    let team = await Team.findById(id)
    if (!team) {
      return res.status(404).json({ message: "Team is not found" })
    }
    const members_ids = JSON.stringify(team.members_ids)
    const member_id_ = JSON.stringify(member_id)
    if (!members_ids.includes(member_id_)) {
      return res.status(400).json({ message: "Member is already not found" })
    }
    team = await Team.findByIdAndUpdate(id, { $pull: { members_ids: member_id } }, { new: true })
    return res.status(200).json({ team, message: "Team leaved successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 200,400,401,403,404,500

//Admin
export const getDashboardTeams = asyncHandler(async (req, res) => {
  try {
    const teams = await Team.find().populate(["members_ids", "leader_id", "company_id"]);
    if (teams.length === 0) {
      return res.status(404).json({ message: "Teams are not found" })
    }
    return res.status(200).json({ teams, message: "Teams fetched successfully" })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
    // res.status(500).json({ message: "Internal Server Error" })
  }
});//status codes 200,401,403,404,500


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