import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';

import Delegate from "../models/DelegateModel.js";
import Company from "../models/CompanyModel.js";
import Notification from "../models/NotificationModel.js";

//Delegate
export const addCompany = asyncHandler(async (req, res) => {
    try {
        const { middleware_id } = req
        let { company_name, company_description, location, field_of_work } = req.body
        const data = { company_name, company_description, location, field_of_work }
        const rules = {
            company_name: 'required|string|between:2,100',
            company_description: 'required|string|between:2,250',
            location: 'required|string|between:2,100',
            field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsCompany = await Company.find({ delegate_id: middleware_id })
        if (existsCompany.length > 0) {
            return res.status(400).json({ message: "You have already company" })
        }
        const companyObject = {
            company_name,
            company_description,
            delegate_id: middleware_id,
            location,
            field_of_work,
        }
        let company = await Company.create(companyObject);
        const delegateObject = {
            company_id: company._id
        }
        await Delegate.findByIdAndUpdate(middleware_id, delegateObject)
        return res.status(201).json({ company, message: "Company added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Delegate
export const getCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsCompany = await Company.findById(id);
        if (!existsCompany) {
            return res.status(404).json({ message: "Company is not found" })
        }
        return res.status(200).json({ company: existsCompany, message: "Company fetched successfully" })
    }
    catch (error) {
        res.status(500).json({message:error.message})
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Delegate
export const updateCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let { company_name, company_description, location, field_of_work } = req.body
        const data = { company_name, company_description, location, field_of_work}
        const rules = {
            company_name: 'required|string|between:2,100',
            company_description: 'required|string|between:2,250',
            location: 'required|string|between:2,100',
            field_of_work: 'required|string|in:Programming,Designing,Content Writing,Translation',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let existsCompany = await Company.findById(id);
        if (!existsCompany || (existsCompany.delegate_id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Company is not found" })
        }
        const CompanyObject = {
            company_name,
            company_description,
            delegate_id: middleware_id,
            location,
            field_of_work,
        }
        let company = await Company.findByIdAndUpdate(id, CompanyObject, { new: true });
        return res.status(200).json({ company, message: "Company updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Delegate
export const deleteCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let existsCompany = await Company.findById(id);
        if (!existsCompany || (existsCompany.delegate_id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Company is not found" })
        }
        await existsCompany.delete()
        const delegateObject = {
            company_id: null
        }
        await Delegate.findByIdAndUpdate(middleware_id, delegateObject)
        
        return res.status(200).json({ company: existsCompany, message: "Company deleted successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const likeCompany = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsCompany = await Company.findById(id)
        if (!existsCompany) {
            return res.status(404).json({ message: "Company is not found" })
        }
        if (existsCompany.likes.includes(middleware_id)) {
            const company = await Company.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["delegate_id"]);
            return res.status(200).json({ company, message: "Company disliked successfully" })
        }
        else {
            const company = await Company.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["delegate_id"]);
            if ((company.delegate_id._id).toString() !== (middleware_id).toString()) {
                // Create Notification And Notify Only User
                const notificationObject = {
                    redirect: `profile/${company.delegate_id._id}`,
                    message: `There is a ${middleware_role} likes your company, go to your profile and check it`,
                    senders: [
                        {
                            sender_id: middleware_id,
                            sender_model: middleware_role,
                        }
                    ],
                    receivers: [
                        {
                            receiver_id: company.delegate_id._id,
                            receiver_model: company.delegate_id.role,
                        }
                    ]
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ company, message: "Company liked successfully" })
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