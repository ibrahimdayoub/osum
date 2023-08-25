import asyncHandler from "express-async-handler"
import Validator from 'validatorjs';
import { isObjectIdOrHexString } from "mongoose";

import Service from "../models/ServiceModel.js";
import Notification from "../models/NotificationModel.js";

//Developer,Delegate
export const addService = asyncHandler(async (req, res) => {
    try {
        const { middleware_role, middleware_id } = req
        let { service_name, service_description, expected_coast, expected_duration, service_experiences, experiences_links } = req.body
        const data = { service_name, service_description, expected_coast, expected_duration, service_experiences, experiences_links }
        const rules = {
            service_name: 'required|string|between:2,100',
            service_description: 'required|string|between:2,500',
            expected_coast: 'required|integer|min:0',
            expected_duration: 'required|integer|min:0',
            service_experiences: 'required|array|between:1,250',
            experiences_links: 'required|array|between:1,250',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        const existsService = await Service.find({ service_name, provider_id: middleware_id })
        if (existsService.length > 0) {
            return res.status(400).json({ message: "You have already service with same name" })
        }
        const serviceObject = {
            service_name,
            service_description,
            provider_id: middleware_id,
            provider_model: middleware_role,
            expected_coast,
            expected_duration,
            service_experiences,
            experiences_links
        }
        let service = await Service.create(serviceObject);
        service = await service.populate(["provider_id"]);
        return res.status(201).json({ service, message: "Service added successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Client,Developer,Delegate,Admin
export const getService = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        let existsService = await Service.findById(id).populate(["provider_id"]);;
        if (!existsService) {
            return res.status(404).json({ message: "Service is not found" })
        }
        return res.status(200).json({ service: existsService, message: "Service fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Developer,Delegate
export const updateService = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id } = req
        let { service_name, service_description, expected_coast, expected_duration, service_experiences, experiences_links } = req.body
        const data = { service_name, service_description, expected_coast, expected_duration, service_experiences, experiences_links }
        const rules = {
            service_name: 'required|string|between:2,100',
            service_description: 'required|string|between:2,500',
            expected_coast: 'required|integer|min:0',
            expected_duration: 'required|integer|min:0',
            service_experiences: 'required|array|between:1,250',
            experiences_links: 'required|array|between:1,250',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        let existsService = await Service.findById(id);
        if (!existsService || (existsService.provider_id).toString() !== (middleware_id).toString()) {
            return res.status(404).json({ message: "Service is not found" })
        }
        const ServiceObject = {
            service_name,
            service_description,
            expected_coast,
            expected_duration,
            service_experiences,
            experiences_links
        }
        let service = await Service.findByIdAndUpdate(id, ServiceObject, { new: true }).populate(["provider_id"]);
        return res.status(200).json({ service, message: "Service updated successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 201,400,401,403,500

//Developer,Delegate
export const deleteService = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        let existsService = await Service.findById(id);
        if (existsService && ((existsService.provider_id).toString() === (middleware_id).toString() || middleware_role === "Admin")) {
            await existsService.delete()
            return res.status(200).json({ service: existsService, message: "Service deleted successfully" })
        }
        else {
            return res.status(404).json({ message: "Service is not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
});//status codes 200,401,403,404,500

//Client,Developer,Delegate,Admin
export const getServices = asyncHandler(async (req, res) => {
    try {
        const { middleware_id, location, target_id } = req.body
        const data = { location };
        const rules = {
            location: 'required|string|between:1,50|in:my_profile,target_profile',
        };
        const validation = new Validator(data, rules);
        if (validation.fails()) {
            const errors = oneFieldResult(validation.errors.errors)
            return res.status(400).json({ errors, message: "Some fields are required or not validated" })
        }
        if (location === "my_profile") {
            const existsServices = await Service.find({ provider_id: middleware_id }).populate(["provider_id"]).sort({ createdAt: -1 })

            if (existsServices.length <= 0) {
                return res.status(404).json({ message: "Services are not found" })
            }
            return res.status(200).json({ services: existsServices, message: "Services fetched successfully" })
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
            const existsServices = await Service.find({ provider_id: target_id }).populate(["provider_id"]).sort({ createdAt: -1 })

            if (existsServices.length <= 0) {
                return res.status(404).json({ message: "Services are not found" })
            }
            return res.status(200).json({ services: existsServices, message: "Services fetched successfully" })
        }
        else {
            return res.status(404).json({ message: "Services are not found" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,400,401,403,404,500

//Client,Developer,Delegate
export const likeService = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const { middleware_id, middleware_role } = req
        const existsService = await Service.findById(id)
        if (!existsService) {
            return res.status(404).json({ message: "Service is not found" })
        }
        if (existsService.likes.includes(middleware_id)) {
            const service = await Service.findByIdAndUpdate(id, { $pull: { likes: middleware_id } }, { new: true }).populate(["provider_id"]);
            return res.status(200).json({ service, message: "Service disliked successfully" })
        }
        else {
            const service = await Service.findByIdAndUpdate(id, { $push: { likes: middleware_id } }, { new: true }).populate(["provider_id"]);
            if ((service.provider_id._id).toString() !== (middleware_id).toString()) {
                // Create Notification And Notify Only User
                const notificationObject = {
                    redirect: `profile/${service.provider_id._id}`,
                    message: `There is a ${middleware_role} likes your service, go to your profile and check it`,
                    senders: [
                        {
                            sender_id: middleware_id,
                            sender_model: middleware_role,
                        }
                    ],
                    receivers: [
                        {
                            receiver_id: service.provider_id._id,
                            receiver_model: service.provider_id.role,
                        }
                    ]
                }
                await Notification.create(notificationObject)
            }
            return res.status(200).json({ service, message: "Service liked successfully" })
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Client,Developer,Delegate
export const searchServices = asyncHandler(async (req, res) => {
    try {
        const key = req.query.key
            ? {
                $or: [
                    { service_name: { $regex: req.query.key, $options: "i" } },
                    { service_description: { $regex: req.query.key, $options: "i" } },
                ]
            }
            : {}
        const services = await Service.find(key).populate(["provider_id"]).sort({ createdAt: -1 })
        if (services.length === 0) {
            return res.status(404).json({ message: "Services are not found" })
        }
        return res.status(200).json({ services, message: "Services fetched successfully" })
    }
    catch (error) {
        res.status(500).json({ message: error.message })
        // res.status(500).json({ message: "Internal Server Error" })
    }
})//status codes 200,401,403,404,500

//Admin
export const getDashboardServices = asyncHandler(async (req, res) => {
    try {
        const services = await Service.find().populate(["provider_id"])
        if (services.length === 0) {
            return res.status(404).json({ message: "Services are not found" })
        }
        return res.status(200).json({ services, message: "Services fetched successfully" })
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