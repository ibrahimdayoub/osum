import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../../Redux/Features/Users/usersSlice';
import { addProject } from '../../../Redux/Features/Projects/projectsSlice';
import { FaCheckDouble, FaCrown, FaCubes, FaList, FaPlus, FaSpinner } from "react-icons/fa"
import { toastify } from '../../../Helper';

const AddProject = ({ location, team_id, isOpenTeams }) => {//my_profile, project
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socketState = useSelector((state) => state.socket);
    const usersState = useSelector((state) => state.users);
    const projectsState = useSelector((state) => state.projects);
    const [clientsUsers, setClientsUsers] = useState([]);
    const [searchClientId, setSearchClientId] = useState("");
    const [projectInput, setProjectInput] = useState({
        project_name: "",
        project_description: "",
        total_coast: "",
        discount_per_day: "",
        expected_duration: "",
        github_link: ""
    });
    const [projectClient, setProjectClient] = useState({});
    const handleProjectInput = (e) => {
        e.persist();
        setProjectInput({ ...projectInput, [e.target.name]: e.target.value });
    };
    const searchClientIdSubmit = (e) => {
        e.persist();
        setSearchClientId(e.target.value);
        const data = {
            key: e.target.value
        }
        dispatch(searchUsers(data))
    }
    const handleProjectClient = (client) => {
        if (projectClient._id === client._id) {
            setProjectClient({})
        }
        else {
            setProjectClient(client)
        }
    }
    const addProjectSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("project_name", projectInput.project_name);
        formData.append("project_description", projectInput.project_description);
        formData.append("total_coast", projectInput.total_coast);
        formData.append("discount_per_day", projectInput.discount_per_day);
        formData.append("expected_duration", projectInput.expected_duration);
        formData.append("github_link", projectInput.github_link);
        formData.append("client_id", projectClient._id ? projectClient._id : "");
        if (location === "team") {
            formData.append("team_id", team_id);
        }
        if (location === "team" && !team_id) {
            toastify("error", 400, "You have to select team")
        }
        else {
            dispatch(addProject(formData))
        }
    }
    useEffect(() => {
        setClientsUsers(usersState.users.filter((user) => {
            return user.role === "Client"
        }))
    }, [usersState.users])
    useEffect(() => {
        if ((Date.now() - projectsState.time < 100) && projectsState.status === 201 && projectsState.message && projectsState.operation === "addProject") {
            toastify("success", projectsState.status, projectsState.message)
            setSearchClientId("")
            setProjectInput({
                project_name: "",
                project_description: "",
                total_coast: "",
                discount_per_day: "",
                expected_duration: "",
                github_link: ""
            })
            setProjectClient({})
            if (!projectsState.projects[0]?.is_personal) {
                let receiversIds = [...projectsState.projects[0].team_id.members_ids]
                if (!projectsState.projects[0]?.is_training) {
                    receiversIds.push(projectsState.projects[0].client_id._id)
                }
                //Add Notification (When Add Project By Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: receiversIds,
                    redirect: "teams",
                    message: "There is a new project created, and you added as member in it",
                })
            }
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 400 || projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "addProject") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "addProject") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [projectsState.status, projectsState.message, projectsState.errors])
    return (
        <div className={
            location === "my_profile" ?
                "bg-dark/[0.025] dark:bg-light/[0.025] p-4 mt-2 mb-1 rounded-md" :
                "text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1"
        }>
            {
                location === "my_profile" ?
                    <h2 className="text-dark dark:text-light text-base">
                        <FaCubes className="inline text-lg mr-2" />
                        Add your project and celeberate with all:
                    </h2> :
                    null
            }
            <form onSubmit={(e) => { addProjectSubmit(e) }} className={location === "my_profile" ? "max-w-5xl mx-auto" : null}>
                <div className={location === "my_profile" ? "my-2" : null}>
                    <div className="mb-1">
                        <label htmlFor="project_name" className="sr-only">
                            Project Name
                        </label>
                        <input
                            value={projectInput.project_name}
                            onChange={handleProjectInput}
                            name="project_name"
                            className={
                                projectsState.errors && projectsState.errors.project_name && projectsState.operation === "addProject" ?
                                    `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                    `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                            }
                            placeholder={projectsState.errors && projectsState.errors.project_name && projectsState.operation === "addProject" ? projectsState.errors.project_name : location !== "my_profile" ? "Project Name" : "What its name ?"}
                        />
                    </div>
                    {
                        (projectInput.project_name || projectInput.project_description || projectInput.total_coast || projectInput.discount_per_day || projectInput.github_link) || location !== "my_profile" ?
                            <>
                                <div className="mb-1">
                                    <label htmlFor="project_description" className="sr-only">
                                        Project Description
                                    </label>
                                    <input
                                        value={projectInput.project_description}
                                        onChange={handleProjectInput}
                                        name="project_description"
                                        className={
                                            projectsState.errors && projectsState.errors.project_description && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }
                                        placeholder={projectsState.errors && projectsState.errors.project_description && projectsState.operation === "addProject" ? projectsState.errors.project_description : "Project Description"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="client" className="sr-only">
                                        Project Client
                                    </label>
                                    <input
                                        value={searchClientId}
                                        onChange={searchClientIdSubmit}
                                        className={
                                            projectsState.errors && projectsState.errors.client_id && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }
                                        placeholder={projectsState.errors && projectsState.errors.client_id && projectsState.operation === "addProject" ? projectsState.errors.client_id : "Project Client"}
                                    />
                                </div>
                                {clientsUsers.length > 0 && searchClientId.length > 0 ?
                                    <div>
                                        {
                                            clientsUsers.map((client) => {
                                                return (
                                                    <div
                                                        onClick={() => { handleProjectClient(client) }}
                                                        className={
                                                            isOpenTeams ?
                                                                "xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer" :
                                                                "sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer"
                                                        }>
                                                        <div
                                                            style={{ backgroundImage: `url(${client.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((client.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden ">
                                                            {
                                                                !client.picture_personal_profile ?
                                                                    <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                                                    null
                                                            }
                                                        </div>
                                                        <div className={
                                                            isOpenTeams ?
                                                                "w-3/4  hidden xs:flex-1 xs:flex flex-col" :
                                                                "w-3/4  hidden sm:flex-1 sm:flex flex-col"
                                                        }>
                                                            <div className="w-full flex items-center text-left">
                                                                <span className={
                                                                    projectClient._id !== client._id ?
                                                                        "text-dark dark:text-light flex-1 text-sm truncate w-2" :
                                                                        "text-queen dark:text-king flex-1 text-sm truncate w-2"
                                                                }>{`${client.first_name} ${client.last_name}`}</span>
                                                            </div>
                                                            <div className="w-full flex items-center text-left">
                                                                <span className={
                                                                    projectClient._id !== client._id ?
                                                                        "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                                        "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                                }>{client.role}</span>
                                                            </div>
                                                            <div className="w-full flex items-center text-left">
                                                                <span className={
                                                                    projectClient._id !== client._id ?
                                                                        "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                                        "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                                }>{client.email}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div> :
                                    clientsUsers.length === 0 && searchClientId.length > 0 ?
                                        <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2 max-w-4xl ml-auto">
                                            <FaList className="inline mb-1 mr-2" />
                                            No clients found
                                        </div> :
                                        null
                                }
                                <div className="mb-1">
                                    <label htmlFor="total_coast" className="sr-only">
                                        Total Coast
                                    </label>
                                    <input
                                        value={projectInput.total_coast}
                                        onChange={handleProjectInput}
                                        type="number"
                                        min="0"
                                        name="total_coast"
                                        className={
                                            projectsState.errors && projectsState.errors.total_coast && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }
                                        placeholder={projectsState.errors && projectsState.errors.total_coast && projectsState.operation === "addProject" ? projectsState.errors.total_coast : "Total Coast"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="discount_per_day" className="sr-only">
                                        Discount Per Day
                                    </label>
                                    <input
                                        value={projectInput.discount_per_day}
                                        onChange={handleProjectInput}
                                        type="number"
                                        min="0"
                                        name="discount_per_day"
                                        className={
                                            projectsState.errors && projectsState.errors.discount_per_day && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }

                                        placeholder={projectsState.errors && projectsState.errors.discount_per_day && projectsState.operation === "addProject" ? projectsState.errors.discount_per_day : "Discount Per Day"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="expected_duration" className="sr-only">
                                        Expected Duration
                                    </label>
                                    <input
                                        value={projectInput.expected_duration}
                                        onChange={handleProjectInput}
                                        type="number"
                                        min="0"
                                        name="expected_duration"
                                        className={
                                            projectsState.errors && projectsState.errors.expected_duration && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }
                                        placeholder={projectsState.errors && projectsState.errors.expected_duration && projectsState.operation === "addProject" ? projectsState.errors.expected_duration : "Expected Duration"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="github_link" className="sr-only">
                                        Project Github Link
                                    </label>
                                    <input
                                        value={projectInput.github_link}
                                        onChange={handleProjectInput}
                                        name="github_link"
                                        type="url"
                                        className={
                                            projectsState.errors && projectsState.errors.github_link && projectsState.operation === "addProject" ?
                                                `placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}` :
                                                `placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none ${location === "my_profile" ? "sm:text-xs" : "sm:text-sm"}`
                                        }
                                        placeholder={projectsState.errors && projectsState.errors.github_link && projectsState.operation === "addProject" ? projectsState.errors.github_link : "Project Github Link"}
                                    />
                                </div>
                            </> :
                            null
                    }
                </div>
                {
                    (projectInput.project_name || projectInput.project_description || projectInput.total_coast || projectInput.discount_per_day || projectInput.github_link) && location === "my_profile" ?
                        <div className='flex justify-end'>
                            <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                                {
                                    projectsState.isLoading && projectsState.operation === "addProject" ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                        <>
                                            <FaCheckDouble className="inline text-xs mr-1 mb-0.5" />
                                            Achive
                                        </>
                                }
                            </button>
                        </div> :
                        null
                }
                {
                    location === "team" ?
                        <button
                            type="submit"
                            className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                        >
                            {
                                projectsState.isLoading && projectsState.operation === "addProject" ? <FaSpinner className="inline text-xl animate-spin" /> :
                                    <>
                                        <FaPlus className="inline text-xs mr-1 mb-0.5" />
                                        {
                                            isOpenTeams ?
                                                <span className="inline text-xs md:text-sm">Create Project {projectClient.length > 0 ? `(${projectClient.length})` : null}</span> :
                                                <span className="hidden sm:inline text-xs md:text-sm">Create Project {projectClient.length > 0 ? `(${projectClient.length})` : null}</span>
                                        }
                                    </>
                            }
                        </button> :
                        null
                }
            </form>
        </div>
    )
}
export default AddProject