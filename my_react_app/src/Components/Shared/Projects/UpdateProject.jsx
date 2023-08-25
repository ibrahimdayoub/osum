import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateProject } from '../../../Redux/Features/Projects/projectsSlice';
import { FaCubes, FaEdit, FaSpinner } from "react-icons/fa"
import { toastify } from '../../../Helper';

const UpdateProject = ({ location, isOpenTeams, setSearchParams, currentProject, setUpdatedProject, setOpenUpdate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const projectsState = useSelector((state) => state.projects);
    const [projectInput, setProjectInput] = useState({
        project_name: currentProject.project_name,
        project_description: currentProject.project_description,
        github_link: currentProject.github_link
    });
    const [openUpdateAlt, setOpenUpdateAlt] = useState(false)
    const handleProjectInput = (e) => {
        e.persist();
        setProjectInput({ ...projectInput, [e.target.name]: e.target.value });
    };
    const updateProjectSubmit = (e) => {
        e.preventDefault();
        const data = {
            "project_name": projectInput.project_name,
            "project_description": projectInput.project_description,
            "github_link": projectInput.github_link
        }
        dispatch(updateProject({ id: currentProject._id, data }))
        setOpenUpdateAlt(true)
    }
    useEffect(() => {
        setProjectInput({
            project_name: currentProject.project_name,
            project_description: currentProject.project_description,
            github_link: currentProject.github_link
        })
    }, [currentProject])
    useEffect(() => {
        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "updateProject") {
            toastify("success", projectsState.status, projectsState.message)
            if (location === "my_profile" && openUpdateAlt) {
                setOpenUpdate("")
            }
            else if (location === "team") {
                setProjectInput({
                    project_name: "",
                    project_description: "",
                    github_link: ""
                })
                setSearchParams("?tab=team")
                setUpdatedProject("")
            }
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 400 || projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "updateProject") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "updateProject") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [projectsState.status, projectsState.message, projectsState.errors])
    return (
        <div className={
            location === "my_profile" ?
                "bg-dark/[0.025] dark:bg-light/[0.025] p-2 mt-2 mb-1 rounded-md max-w-5xl mx-auto" :
                "text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1"
        }>
            {
                location === "my_profile" ?
                    <h2 className="text-dark dark:text-light text-base">
                        <FaCubes className="inline text-lg mr-2" />
                        Update your project and celeberate with all:
                    </h2> :
                    null
            }
            <form onSubmit={(e) => { updateProjectSubmit(e) }}>
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
                                projectsState.errors && projectsState.errors.project_name && projectsState.operation === "updateProject" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={projectsState.errors && projectsState.errors.project_name && projectsState.operation === "updateProject" ? projectsState.errors.project_name : "Project Name"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="project_description" className="sr-only">
                            Project Description
                        </label>
                        <input
                            value={projectInput.project_description}
                            onChange={handleProjectInput}
                            name="project_description"
                            className={
                                projectsState.errors && projectsState.errors.project_description && projectsState.operation === "updateProject" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={projectsState.errors && projectsState.errors.project_description && projectsState.operation === "updateProject" ? projectsState.errors.project_description : "Project Description"}
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
                                projectsState.errors && projectsState.errors.github_link && projectsState.operation === "updateProject" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={projectsState.errors && projectsState.errors.github_link && projectsState.operation === "updateProject" ? projectsState.errors.github_link : "Project Github Link"}
                        />
                    </div>
                </div>
                {
                    location === "my_profile" ?
                        <div className='flex justify-end'>
                            <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                                {
                                    projectsState.isLoading && projectsState.operation === "updateProject" ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                        <>
                                            <FaEdit className="inline text-xs mr-1 mb-0.5" />
                                            Update
                                        </>
                                }
                            </button>
                        </div> :
                        null
                }
                {
                    location !== "my_profile" ?
                        <button
                            type="submit"
                            className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                        >
                            {
                                projectsState.isLoading && projectsState.operation === "updateProject" ? <FaSpinner className="inline text-xl animate-spin" /> :
                                    <>
                                        <FaEdit className="inline text-xs mr-1 mb-0.5" />
                                        {
                                            isOpenTeams ?
                                                <span className="inline text-xs md:text-sm">Update Project</span> :
                                                <span className="hidden sm:inline text-xs md:text-sm">Update Project</span>
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
export default UpdateProject