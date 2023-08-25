import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServices, likeService, deleteService } from "../../../Redux/Features/Services/servicesSlice";
import { FaArrowRight, FaEdit, FaHeart, FaList, FaRegHeart, FaSpinner, FaTrash } from "react-icons/fa";
import UpdateService from "./UpdateService";
import { toastify } from "../../../Helper";

const GetServices = ({ location, target_id, services }) => { //my_profile, target_profile (with target_id),search (with services)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const servicesState = useSelector((state) => state.services);
    const [showUpdate, setShowUpdate] = useState('')
    const [currentLikedServiceId, setCurrrentLikedServiceId] = useState('')
    const likeServiceSubmit = (serviceId) => {
        setCurrrentLikedServiceId(serviceId)
        const data = {
            id: serviceId
        }
        dispatch(likeService(data))
    }
    const deleteServiceSubmit = (serviceId) => {
        const data = {
            id: serviceId
        }
        dispatch(deleteService(data))
    }
    useEffect(() => {
        if (location !== "search") {
            const data = {
                location,
                target_id: target_id ? target_id : ""
            }
            dispatch(getServices({ data }))
        }
    }, [target_id])
    useEffect(() => {
        if ((Date.now() - servicesState.time < 100) && servicesState.status === 200 && servicesState.message && servicesState.operation === "getServices") {
            toastify("success", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && (servicesState.status === 400 || servicesState.status === 401 || servicesState.status === 403) && servicesState.message && servicesState.operation === "getServices") {
            toastify("error", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && servicesState.status === 500 && servicesState.message && servicesState.operation === "getServices") {
            toastify("warn", servicesState.status, servicesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - servicesState.time < 100) && servicesState.status === 200 && servicesState.message && servicesState.operation === "deleteService") {
            toastify("success", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && (servicesState.status === 401 || servicesState.status === 403 || servicesState.status === 404) && servicesState.message && servicesState.operation === "deleteService") {
            toastify("error", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && servicesState.status === 500 && servicesState.message && servicesState.operation === "deleteService") {
            toastify("warn", servicesState.status, servicesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - servicesState.time < 100) && servicesState.status === 200 && servicesState.message && servicesState.operation === "likeService") {
            toastify("success", servicesState.status, servicesState.message)

            const currentLikedService = servicesState.services.filter((service) => {
                return service._id === currentLikedServiceId
            })[0]
            if (currentLikedService.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Service By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedService.provider_id._id],
                    redirect: `profile/${currentLikedService.provider_id._id}`,
                    message: `There is a ${authState.auth.user.role} likes your service, go to your profile and check it`,
                })
            }
        }
        else if ((Date.now() - servicesState.time < 100) && (servicesState.status === 401 || servicesState.status === 403 || servicesState.status === 404) && servicesState.message && servicesState.operation === "likeService") {
            toastify("error", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && servicesState.status === 500 && servicesState.message && servicesState.operation === "likeService") {
            toastify("warn", servicesState.status, servicesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [servicesState.status, servicesState.message, servicesState.errors])
    return (
        (services || servicesState.services).length > 0 ?
            (services || servicesState.services).map((service) => {
                return (
                    <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-2  rounded-md my-2">
                        <div className="flex justify-between flex-wrap items-center mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
                            <div className="lg:max-w-[75%]">
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Service Name:</span>
                                    <span className="text-dark/50 dark:text-light/50">{service.service_name}</span>
                                </p>
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Service Description:</span>
                                    <span className="text-dark/50 dark:text-light/50">{service.service_description}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Expected Coast:</span>
                                    <span className="text-dark/50 dark:text-light/50">{service.expected_coast} $</span>
                                </p>
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Expected Duration:</span>
                                    <span className="text-dark/50 dark:text-light/50">{service.expected_duration} Day/s</span>
                                </p>
                                {
                                    authState.auth.user._id !== service.provider_id._id ?
                                        <Link
                                            to={`../profile/${service.provider_id._id}`} state={{ targetRole: service.provider_id.role, backTo: "search" }}
                                            className="text-queen dark:text-king">
                                            Visit Provider<FaArrowRight className="inline ml-2" />
                                        </Link> :
                                        null
                                }
                            </div>
                        </div>
                        <div className="max-w-5xl mx-auto" >
                            <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
                                <div className="flex-1">
                                    <span className="text-queen dark:text-king block">Service Experiences:</span>
                                    {
                                        service.service_experiences?.length > 0 ?
                                            <ul className="list-disc ml-4">
                                                {
                                                    service.service_experiences.map((experience) => {
                                                        return (
                                                            <li className="text-dark/50 dark:text-light/50"> {experience}</li>
                                                        )
                                                    })
                                                }
                                            </ul> :
                                            <span className="text-dark/50 dark:text-light/50"> No experiences found</span>
                                    }
                                </div>
                                <div className="flex-1">
                                    <span className="text-queen dark:text-king block">Experiences Links:</span>
                                    {
                                        service.experiences_links?.length > 0 ?
                                            <ul className="list-disc ml-4">
                                                {
                                                    service.experiences_links.map((link) => {
                                                        return (
                                                            <li className="text-dark/50 dark:text-light/50">
                                                                <a href={link} target="_blank" rel="noreferrer">{link}</a>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul> :
                                            <span className="text-dark/50 dark:text-light/50"> No links found</span>
                                    }
                                </div>
                            </div>
                            {/* Update, Likes and Comments */}
                            <div className={
                                service.provider_id._id === authState.auth.user._id ?
                                    "text-queen dark:text-king flex justify-between items-center text-sm mt-2" :
                                    "text-queen dark:text-king flex justify-end items-center text-sm"
                            }
                            >
                                {
                                    service.provider_id._id === authState.auth.user._id ?
                                        <div>
                                            <button onClick={() => { deleteServiceSubmit(service._id) }} className="mr-2">
                                                {
                                                    (servicesState.isLoading && servicesState.operation === "deleteService") ? <FaSpinner className="inline text-base ml-1" /> :
                                                        <>
                                                            <FaTrash className="inline text-start text-base" />
                                                        </>
                                                }
                                            </button>
                                            <button onClick={() => { setShowUpdate(showUpdate === service._id ? '' : service._id) }}>
                                                <FaEdit className="inline text-base" />
                                            </button>
                                        </div> :
                                        null
                                }
                                <button onClick={() => { likeServiceSubmit(service._id) }}>
                                    {service.likes.length}
                                    {
                                        service.likes.includes(authState.auth.user._id) ?
                                            <FaHeart className="inline text-base ml-1" /> :
                                            <FaRegHeart className="inline text-base ml-1" />
                                    }
                                </button>
                            </div>
                            {
                                showUpdate === service._id ?
                                    <UpdateService service={service} setShowUpdate={setShowUpdate} /> :
                                    null
                            }
                        </div>
                    </div>
                )
            }) :
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2">
                <FaList className="inline mb-1 mr-2" />
                No services found
            </div>
    )
}
export default GetServices