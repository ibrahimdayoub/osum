import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardProjects } from "../../../Redux/Features/Projects/projectsSlice";
import { format } from 'date-fns';

const GetDashboardProjects = ({ setCounter, keyword }) => {
    const dispatch = useDispatch();
    const projectsState = useSelector((state) => state.projects);
    const [searchResults, setSearchResults] = useState(null)
    useEffect(() => {
        dispatch(getDashboardProjects())
    }, [])
    useEffect(() => {
        const regex = new RegExp(keyword, "i")
        setSearchResults(
            projectsState.projects.filter((project) => {
                return regex.test(project.project_name) || regex.test(project.project_description) || regex.test(project.github_link)
            })
        )
    }, [keyword])
    useEffect(() => {
        setCounter(searchResults?.length ? searchResults.length : projectsState.projects.length)
    }, [searchResults])
    return (
        (searchResults?.length > 0 ? searchResults : projectsState.projects).map((project) => {
            return (
                <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-2 rounded-md mb-2">
                    <p className="mx-2">
                        <span className=" text-dark dark:text-light mr-1">Project Name:</span>
                        <span className="text-dark/50 dark:text-light/50">{project.project_name}</span>
                    </p>
                    <p className="mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
                        <span className=" text-dark dark:text-light mr-1">Project Description:</span>
                        <span className="text-dark/50 dark:text-light/50">{project.project_description}</span>
                    </p>
                    <div className="max-w-5xl mx-auto" >
                        <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
                            <div className="flex-1 flex flex-wrap flex-col items-start">
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Creator:</span>
                                    <span className="text-dark/50 dark:text-light/50"> {`${project.creator_id.first_name} ${project.creator_id.last_name}`} </span>
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
                                                <span className="text-dark/50 dark:text-light/50">{`${project.client_id.first_name} ${project.client_id.last_name}`}</span>
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
                    </div>
                </div>
            )
        })
    )
}
export default GetDashboardProjects