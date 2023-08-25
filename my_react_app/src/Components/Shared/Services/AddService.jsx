import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addService } from '../../../Redux/Features/Services/servicesSlice';
import { FaBoxOpen, FaMarker, FaSpinner } from "react-icons/fa"
import { toastify } from '../../../Helper';

const AddService = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const servicesState = useSelector((state) => state.services);
    const [serviceInput, setServiceInput] = useState({
        service_name: "",
        service_description: "",
        expected_coast: "",
        expected_duration: "",
        service_experiences: "",
        experiences_links: ""
    });
    const handleServiceInput = (e) => {
        e.persist();
        setServiceInput({ ...serviceInput, [e.target.name]: e.target.value });
    };
    const addServiceSubmit = (e) => {
        e.preventDefault();
        let serviceExperiences = serviceInput.service_experiences.split(",")
        serviceExperiences = serviceExperiences.filter((serviceExperience) => {
            return serviceExperience
        })
        let experiencesLinks = serviceInput.experiences_links.split(",")
        experiencesLinks = experiencesLinks.filter((experiencesLink) => {
            return experiencesLink
        })
        const data = {
            "service_name": serviceInput.service_name,
            "service_description": serviceInput.service_description,
            "expected_coast": serviceInput.expected_coast,
            "expected_duration": serviceInput.expected_duration,
            "service_experiences": serviceExperiences,
            "experiences_links": experiencesLinks
        }
        dispatch(addService({ data }))
    }
    useEffect(() => {
        if ((Date.now() - servicesState.time < 100) && servicesState.status === 201 && servicesState.message && servicesState.operation === "addService") {
            toastify("success", servicesState.status, servicesState.message)
            setServiceInput({
                service_name: "",
                service_description: "",
                expected_coast: "",
                expected_duration: "",
                service_experiences: "",
                experiences_links: ""
            })
        }
        else if ((Date.now() - servicesState.time < 100) && (servicesState.status === 400 || servicesState.status === 401 || servicesState.status === 403 || servicesState.status === 404) && servicesState.message && servicesState.operation === "addService") {
            toastify("error", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && servicesState.status === 500 && servicesState.message && servicesState.operation === "addService") {
            toastify("warn", servicesState.status, servicesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [servicesState.status, servicesState.message, servicesState.errors])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] p-4 mt-2 mb-1 rounded-md">
            <h2 className="text-dark dark:text-light text-base">
                <FaBoxOpen className="inline text-lg mr-2" />
                Add your service and work with all:
            </h2>
            <form onSubmit={(e) => { addServiceSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1">
                        <label htmlFor="service_name" className="sr-only">
                            Service Name
                        </label>
                        <input
                            value={serviceInput.service_name}
                            onChange={handleServiceInput}
                            name="service_name"
                            className={
                                servicesState.errors && servicesState.errors.service_name && servicesState.operation === "addService" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={servicesState.errors && servicesState.errors.service_name && servicesState.operation === "addService" ? servicesState.errors.service_name : "What its name ?"}
                        />
                    </div>
                    {
                        serviceInput.service_name || serviceInput.service_description || serviceInput.expected_coast || serviceInput.expected_duration || serviceInput.service_experiences ?
                            <>
                                <div className="mb-1">
                                    <label htmlFor="service_description" className="sr-only">
                                        Service Description
                                    </label>
                                    <input
                                        value={serviceInput.service_description}
                                        onChange={handleServiceInput}
                                        name="service_description"
                                        className={
                                            servicesState.errors && servicesState.errors.service_description && servicesState.operation === "addService" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                        }
                                        placeholder={servicesState.errors && servicesState.errors.service_description && servicesState.operation === "addService" ? servicesState.errors.service_description : "Service Description"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="expected_coast" className="sr-only">
                                        Total Coast
                                    </label>
                                    <input
                                        value={serviceInput.expected_coast}
                                        onChange={handleServiceInput}
                                        type="number"
                                        min="0"
                                        name="expected_coast"
                                        className={
                                            servicesState.errors && servicesState.errors.expected_coast && servicesState.operation === "addService" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                        }
                                        placeholder={servicesState.errors && servicesState.errors.expected_coast && servicesState.operation === "addService" ? servicesState.errors.expected_coast : "Total Coast"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="expected_duration" className="sr-only">
                                        Expected Duration
                                    </label>
                                    <input
                                        value={serviceInput.expected_duration}
                                        onChange={handleServiceInput}
                                        type="number"
                                        min="0"
                                        name="expected_duration"
                                        className={
                                            servicesState.errors && servicesState.errors.expected_duration && servicesState.operation === "addService" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                        }
                                        placeholder={servicesState.errors && servicesState.errors.expected_duration && servicesState.operation === "addService" ? servicesState.errors.expected_duration : "Expected Duration"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="service_experiences" className="sr-only">
                                        Service Experiences
                                    </label>
                                    <input
                                        value={serviceInput.service_experiences}
                                        onChange={handleServiceInput}
                                        name="service_experiences"
                                        className={
                                            servicesState.errors && servicesState.errors.service_experiences && servicesState.operation === "addService" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                        }
                                        placeholder={servicesState.errors && servicesState.errors.service_experiences && servicesState.operation === "addService" ? servicesState.errors.service_experiences : "Service experiences and separate it by comma !"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="experiences_links" className="sr-only">
                                        Experiences Links
                                    </label>
                                    <input
                                        value={serviceInput.experiences_links}
                                        onChange={handleServiceInput}
                                        name="experiences_links"
                                        className={
                                            servicesState.errors && servicesState.errors.experiences_links && servicesState.operation === "addService" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                        }
                                        placeholder={servicesState.errors && servicesState.errors.experiences_links && servicesState.operation === "addService" ? servicesState.errors.experiences_links : "Experiences links and separate it by comma !"}
                                    />
                                </div>
                            </> :
                            null
                    }
                </div>
                {
                    serviceInput.service_name || serviceInput.service_description || serviceInput.expected_coast || serviceInput.expected_duration || serviceInput.service_experiences ?
                        <div className='flex justify-end'>
                            <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                                {
                                    servicesState.isLoading && servicesState.operation === "addService" ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                        <>
                                            <FaMarker className="inline text-xs mr-1 mb-0.5" />
                                            Notify
                                        </>
                                }
                            </button>
                        </div> :
                        null
                }
            </form>
        </div>
    )
}
export default AddService