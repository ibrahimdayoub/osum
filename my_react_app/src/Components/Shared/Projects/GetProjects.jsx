import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProjects, completeProject, retreatProject, likeProject } from "../../../Redux/Features/Projects/projectsSlice";
import { FaCalendarAlt, FaCrown, FaDoorClosed, FaDoorOpen, FaEdit, FaHeart, FaHourglassEnd, FaHourglassStart, FaList, FaMoneyBillWave, FaRegHeart, FaTimes } from "react-icons/fa"
import { format } from 'date-fns'
import UpdateProject from "./UpdateProject";
import { toastify } from "../../../Helper";

const GetProjects = ({ location, target_id, team_id, currentProject, setCurrentProject, setUpdatedProject, setSearchParams, isOpenProjects, projects }) => {//my_profile, target_profile (with target_id), team (with team_id), tasks, search (with projects)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const paypal = useRef();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const themeState = useSelector((state) => state.theme);
    const projectsState = useSelector((state) => state.projects);
    const [openUpdate, setOpenUpdate] = useState("")
    const [openPayment, setOpenPayment] = useState("")
    const [currentProjectPayment, setCurrentProjectPayment] = useState("")
    const [currentLikedProjectId, setCurrrentLikedProjectId] = useState('')
    const handleOpenUpdate = (project) => {
        if (location === "team") {
            setCurrentProject(project)
            setUpdatedProject(project._id)
            setSearchParams("?tab=teams")
        }
        setOpenUpdate(openUpdate === project._id ? "" : project._id)
    }
    const completeProjectSubmit = (projectId) => {
        dispatch(completeProject({ id: projectId }))
    }
    const retreatProjectSubmit = (projectId) => {
        dispatch(retreatProject({ id: projectId }))
    }
    const likeProjectSubmit = (projectId) => {
        setCurrrentLikedProjectId(projectId)
        dispatch(likeProject({ id: projectId }))
    }
    useEffect(() => {
        if (location !== "search" /*&& (location === "teams" && !target_id)*/) {
            const data = {
                location,
                target_id: target_id ? target_id : "",
                team_id: team_id ? team_id : ""
            }
            dispatch(getProjects(data))
        }
    }, [target_id, team_id])
    useEffect(() => {
        if (currentProjectPayment && openPayment) {
            window.paypal?.Buttons({
                style: {
                    layout: "horizontal",
                    size: "small",
                    label: "pay",
                    height: 32,
                    tagline: "false",
                    borderRadius: 12,
                    color: themeState.theme === "light" ? "black" : "white"
                },
                createOrder: (data, actions, err) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: `${currentProjectPayment.project_name} (${currentProjectPayment.project_description})`,
                                amount: {
                                    currency_code: "USD",
                                    value: currentProjectPayment.total_coast,
                                    quantity: 4
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const order = await actions.order.capture();
                    console.log(order);
                    toastify("success", 200, "Proccess completed successfully")
                    completeProjectSubmit(currentProjectPayment._id)
                },
                onError: (error) => {
                    console.log(error);
                    toastify("error", 400, "Something went error durring payment proccess")
                },
            })
                .render(paypal.current);
        }
    }, [currentProjectPayment, openPayment]);
    useEffect(() => {
        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "getProjects") {
            toastify("success", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 400 || projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "getProjects") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "getProjects") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "completeProject") {
            toastify("success", projectsState.status, projectsState.message)
            setOpenPayment("")
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 400 || projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "completeProject") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "completeProject") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "retreatProject") {
            toastify("success", projectsState.status, projectsState.message)
            setOpenPayment("")
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 400 || projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "retreatProject") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "retreatProject") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "likeProject") {
            toastify("success", projectsState.status, projectsState.message)
            const currentLikedProject = projectsState.projects.filter((project) => {
                return project._id === currentLikedProjectId
            })[0]
            if (currentLikedProject.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Project By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedProject.creator_id._id, currentLikedProject.client_id?._id, ...currentLikedProject.team_id?.members_ids],
                    redirect: `teams`,
                    message: `There is a ${authState.auth.user.role} likes your project, go to your teams and check it`,
                })
            }
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "likeProject") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "likeProject") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [projectsState.status, projectsState.message, projectsState.errors])
    return (
        location === "team" && !team_id ?
            <div className="h-full pb-4 text-dark/50 dark:text-light/50 text-base mx-2 flex items-center justify-center rounded-md">
                Select team to disply team projects...
            </div> :
            (projects || projectsState.projects).length > 0 ?
                <div className={
                    location !== "tasks" ?
                        "py-1.5 flex flex-col gap-1" :
                        "flex flex-col"
                }>
                    {
                        (projects || projectsState.projects).map((project) => {
                            return (
                                location !== "tasks" ?
                                    <div className={
                                        location === "my_profile" || location === "target_profile" ?
                                            "bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-1 pt-2 px-2 rounded-md mb-1" :
                                            location === "search" ?
                                                "bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-1 pt-2 px-2 rounded-md mb-1 -mt-1.5" :
                                                "bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-1 pt-2 px-2 rounded-md"
                                    }>
                                        <p className="mx-2">
                                            <span className=" text-dark dark:text-light mr-1">Project Name:</span>
                                            <span className="text-dark/50 dark:text-light/50">{project.project_name}</span>
                                        </p>
                                        <p className="mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
                                            <span className=" text-dark dark:text-light mr-1">Project Description:</span>
                                            <span className="text-dark/50 dark:text-light/50">{project.project_description}</span>
                                        </p>
                                        <div className={
                                            location === "my_profile" || location === "target_profile" || location === "search" ?
                                                "max-w-5xl mx-auto" :
                                                null
                                        }>
                                            <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
                                                <div className="flex-1 flex flex-wrap flex-col items-start">
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Creator:</span>
                                                        <Link
                                                            to={`../profile/${project.creator_id._id}`} state={{ targetRole: project.creator_id.role, backTo: location === "search" ? "search" : "teams" }}
                                                            className="text-dark/50 dark:text-light/50">
                                                            {`${project.creator_id.first_name} ${project.creator_id.last_name}`}
                                                        </Link>
                                                    </p>
                                                    {
                                                        !project.is_personal ?
                                                            <>
                                                                <p>
                                                                    <span className=" text-dark dark:text-light mr-1">Team:</span>
                                                                    <span className="text-dark/50 dark:text-light/50">{project.team_id.team_name}</span>
                                                                </p>
                                                                {
                                                                    project.team_id.company_id ?
                                                                        <p>
                                                                            <span className=" text-dark dark:text-light mr-1">Company:</span>
                                                                            <span className="text-dark/50 dark:text-light/50">{project.team_id.company_id.company_name}</span>
                                                                        </p> :
                                                                        null
                                                                }
                                                            </> :
                                                            null
                                                    }
                                                    {
                                                        !project.is_training ?
                                                            <>
                                                                <p>
                                                                    <span className=" text-dark dark:text-light mr-1">Client:</span>
                                                                    {/* <span className="text-dark/50 dark:text-light/50">{`${project.client_id.first_name} ${project.client_id.last_name}`}</span> */}
                                                                    <Link
                                                                        to={`../profile/${project.client_id._id}`} state={{ targetRole: project.client_id.role, backTo: location === "search" ? "search" : "teams" }}
                                                                        className="text-dark/50 dark:text-light/50">
                                                                        {`${project.client_id.first_name} ${project.client_id.last_name}`}
                                                                    </Link>
                                                                </p>
                                                                <p>
                                                                    <span className=" text-dark dark:text-light mr-1">Total Coast:</span>
                                                                    <span className="text-dark/50 dark:text-light/50">{project.total_coast} $</span>
                                                                </p>
                                                                <p>
                                                                    <span className=" text-dark dark:text-light mr-1">Discount Per Day:</span>
                                                                    <span className="text-dark/50 dark:text-light/50">{project.discount_per_day} $</span>
                                                                </p>
                                                            </> :
                                                            null
                                                    }
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Status:</span>
                                                        <span className="text-queen dark:text-king">{project.status}</span>
                                                    </p>
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Github Link:</span>
                                                        <a target="_balnk" href={project.github_link} className="text-dark/50 dark:text-light/50">{project.github_link}</a>
                                                    </p>
                                                </div>
                                                <div className="flex-1 flex flex-wrap flex-col items-start">
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Start Date:</span>
                                                        <span className="text-dark/50 dark:text-light/50">{format(new Date(project.start_date), 'dd/MM/yyyy')}</span>
                                                    </p>
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">End Date:</span>
                                                        <span className="text-dark/50 dark:text-light/50">{format(new Date(project.end_date), 'dd/MM/yyyy')}</span>
                                                    </p>
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Delay:</span>
                                                        <span className="text-dark/50 dark:text-light/50">{project.delay} Day/s</span>
                                                    </p>
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Is Personal:</span>
                                                        <span className="text-queen dark:text-king">{project.is_personal ? "Yes" : "No"}</span>
                                                    </p>
                                                    <p>
                                                        <span className=" text-dark dark:text-light mr-1">Is Trining:</span>
                                                        <span className="text-queen dark:text-king">{project.is_training ? "Yes" : "No"}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={
                                                project.creator_id?._id === authState.auth.user._id || project.client_id?._id === authState.auth.user._id || project.team_id?.members_ids.includes(authState.auth.user._id) ?
                                                    "mx-2 flex flex-wrap justify-between items-center gap-2 mt-2" :
                                                    "mx-2 flex flex-wrap justify-end items-center gap-2"
                                            }>
                                                <button onClick={() => { likeProjectSubmit(project._id) }} title="like" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                                    {project?.likes?.length}
                                                    {
                                                        project?.likes?.includes(authState.auth.user._id) ?
                                                            <FaHeart className="inline text-base ml-1" /> :
                                                            <FaRegHeart className="inline text-base ml-1" />
                                                    }
                                                </button>
                                                <div>
                                                    {
                                                        project.creator_id._id === authState.auth.user._id || project.team_id?.leader_id === authState.auth.user._id || project.team_id?.members_ids.includes(authState.auth.user._id) ?
                                                            <Link
                                                                title="Tasks"
                                                                to={`../tasks`} state={{ projectId: project._id, backTo: location === "team" ? "teams" : location === "my_profile" ? `profile/${authState.auth.user._id}` : location === "target_profile" ? `profile/${target_id}` : "" }}
                                                                className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                                <FaCalendarAlt className="text-base inline mb-2.5 mr-0.5" />
                                                            </Link> :
                                                            null
                                                    }
                                                    {
                                                        authState.auth.user._id === project.creator_id._id ?
                                                            <>
                                                                <button onClick={() => { handleOpenUpdate(project) }} title="Edit" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                                    <FaEdit className="text-base" />
                                                                </button>
                                                                {
                                                                    project.status === "Started Project" ?
                                                                        <button onClick={() => { completeProjectSubmit(project._id) }} title="Complete" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                                            <FaHourglassStart className="text-base" />
                                                                        </button> :
                                                                        project.status === "Completed Project" ?
                                                                            <button onClick={() => { completeProjectSubmit(project._id) }} title="Start" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                                                <FaHourglassEnd className="text-base" />
                                                                            </button> :
                                                                            null
                                                                }
                                                            </> :
                                                            authState.auth.user._id === project.client_id?._id && project.status === "Completed Project" ?
                                                                <button onClick={() => { setOpenPayment(openPayment === project._id ? "" : project._id); setCurrentProjectPayment(project) }} title="Payment" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                                    <FaMoneyBillWave className="text-lg -mb-0.5" />
                                                                </button> :
                                                                null
                                                    }
                                                    {
                                                        (authState.auth.user._id === project.creator_id?._id || authState.auth.user._id === project.client_id?._id) && project.status !== "Completed Payment" ?
                                                            <button onClick={() => { retreatProjectSubmit(project._id) }} title="Retreat" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                                                {
                                                                    project.status === "Retreated Developers" || project.status === "Retreated Clients" ?
                                                                        <FaDoorClosed className="text-lg" /> :
                                                                        <FaDoorOpen className="text-lg" />
                                                                }
                                                            </button> :
                                                            null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            (location === "my_profile" || location === "target_profile" || location === "search") && openUpdate === project._id ?
                                                <div className="mx-2">
                                                    <UpdateProject location="my_profile" currentProject={project} setOpenUpdate={setOpenUpdate} />
                                                </div> :
                                                null
                                        }
                                        {
                                            openPayment === project._id ?
                                                <div className="bg-dark/[0.025] dark:bg-light/[0.025] max-w-5xl mt-2 mb-0 mx-auto rounded-md p-2 flex justify-between items-center gap-2 flex-wrap">
                                                    <span className="text-dark dark:text-light text-sm ">Complete payment proccess with <span className="text-queen dark:text-king">PayPal</span> platform:</span>
                                                    <div ref={paypal} className="flex-1"></div>
                                                </div> :
                                                null
                                        }
                                    </div> :
                                    <div onClick={() => { setCurrentProject(project) }} className={
                                        isOpenProjects ?
                                            `${project._id === currentProject._id ? "border border-queen/25 dark:border-king/25" : null} xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer` :
                                            `${project._id === currentProject._id ? "border border-queen/25 dark:border-king/25" : null} sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer`
                                    }>
                                        <div
                                            style={{ backgroundImage: `url(${project.project_picture ? process.env.REACT_APP_BACK_END_URL + ((project.project_picture).substring(7)).replace("\\", "/") : null})` }}
                                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden mx-auto">
                                            {
                                                !project.project_picture ?
                                                    <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                                    null
                                            }
                                        </div>
                                        <div className={
                                            isOpenProjects ?
                                                "w-3/4  hidden xs:flex-1 xs:flex flex-col" :
                                                "w-3/4  hidden sm:flex-1 sm:flex flex-col"
                                        }>
                                            <div className="w-full flex items-center text-left">
                                                <span className="text-dark dark:text-light flex-1 text-sm truncate w-2">{project.project_name}</span>
                                            </div>
                                            <div className="w-full flex text-left items-center">
                                                <div className="flex-1 flex truncate w-2" style={{ lineHeight: "0px" }}>
                                                    <span className="text-queen dark:text-king text-xs truncate max-w-[75%]">{project.project_description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            )
                        })
                    }
                </div> :
                location === "team" ?
                    <div className="text-dark/50 pb-4 dark:text-light/50 h-full flex justify-center items-center text-base animation duration-1000 slide-in-up">
                        <span>
                            <FaList className="inline mb-1 mr-2" />
                            No projects found
                        </span>
                    </div> :
                    location === "tasks" ?
                        <div className="text-dark/50 dark:text-light/50 text-center text-xs sm:text-lg px-4 py-10 h-full">
                            Create project to work...
                        </div> :
                        <div className="h-[50px] my-2 bg-dark/[0.025] dark:bg-light/[0.025] text-dark/50 dark:text-light/50 flex justify-center items-center text-sm animation duration-1000 slide-in-up">
                            <span>
                                <FaList className="inline mb-1 mr-2" />
                                No projects found
                            </span>
                        </div>
    )
}
export default GetProjects