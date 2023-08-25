import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { checkTask, deleteTask, getTasks } from "../../../Redux/Features/Tasks/tasksSlice";
import { FaCalendarAlt, FaCheckSquare, FaEdit, FaList, FaRegSquare, FaTrash } from "react-icons/fa"
import { format } from "date-fns"
import { toastify } from "../../../Helper";

const GetTasks = ({ project_id, setCurrentTask, setUpdatedTask, setSearchParams }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tasksState = useSelector((state) => state.tasks);
    const [openUpdate, setOpenUpdate] = useState("")
    const handleOpenUpdate = (task) => {
        setCurrentTask(task)
        setUpdatedTask(task._id)
        setSearchParams("?tab=projects")
        setOpenUpdate(openUpdate === task._id ? "" : task._id)
    }
    const deleteTaskSubmit = (taskId) => {
        const data = {
            id: taskId
        }
        dispatch(deleteTask(data))
    }
    const checkTaskSubmit = (taskId) => {
        const data = {
            id: taskId
        }
        dispatch(checkTask(data))
    }
    useEffect(() => {
        const data = {
            project_id: project_id
        }
        if (project_id) {
            dispatch(getTasks({ data }))
        }
    }, [project_id])
    useEffect(() => {
        if ((Date.now() - tasksState.time < 100) &&tasksState.status === 200 && tasksState.message && tasksState.operation === "getTasks") {
            toastify("success", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&(tasksState.status === 400 || tasksState.status === 401 || tasksState.status === 403) && tasksState.message && tasksState.operation === "getTasks") {
            toastify("error", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&tasksState.status === 500 && tasksState.message && tasksState.operation === "getTasks") {
            toastify("warn", tasksState.status, tasksState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - tasksState.time < 100) &&tasksState.status === 200 && tasksState.message && tasksState.operation === "deleteTask") {
            toastify("success", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&(tasksState.status === 401 || tasksState.status === 403 || tasksState.status === 404) && tasksState.message && tasksState.operation === "deleteTask") {
            toastify("error", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&tasksState.status === 500 && tasksState.message && tasksState.operation === "deleteTask") {
            toastify("warn", tasksState.status, tasksState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - tasksState.time < 100) &&tasksState.status === 200 && tasksState.message && tasksState.operation === "checkTask") {
            toastify("success", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&(tasksState.status === 401 || tasksState.status === 403 || tasksState.status === 404) && tasksState.message && tasksState.operation === "checkTask") {
            toastify("error", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&tasksState.status === 500 && tasksState.message && tasksState.operation === "checkTask") {
            toastify("warn", tasksState.status, tasksState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [tasksState.status, tasksState.message, tasksState.errors])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] m-2 py-2 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-base text-dark dark:text-light border-dark/50 dark:border-light/50 w-fit mx-2 border-b">
                    <FaCalendarAlt className="inline text-xl mb-1 mr-2" />
                    Tasks:
                </h2>
            </div>
            {
                !project_id ?
                    <div className="min-h-[540px] text-dark/50 dark:text-light/50 text-base mx-2 pb-2 flex items-center justify-center rounded-md">
                        Select project to disply project tasks...
                    </div> :
                    tasksState.tasks.length > 0 ?
                        <div className="h-[540px] max-h-[540px] overflow-y-scroll px-2 py-1.5 gap-1">
                            {
                                tasksState.tasks.map((task) => {
                                    return (
                                        <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-1 pt-2 px-2 rounded-md mb-1">
                                            <p className="mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
                                                <button onClick={() => { checkTaskSubmit(task._id) }} title="Check" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                    {
                                                        task.is_checked ?
                                                            <FaCheckSquare className="text-base -mb-1" /> :
                                                            <FaRegSquare className="text-base -mb-1 " />
                                                    }
                                                </button>
                                                <span className="text-dark/50 dark:text-light/50">{task.content}</span>
                                            </p>
                                            <div>
                                                <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
                                                    <div className="flex-1 flex flex-wrap flex-col items-start">
                                                        <p>
                                                            <span className=" text-dark dark:text-light mr-1">Creator:</span>
                                                            <Link
                                                                to={`../profile/${task.creator_id._id}`} state={{ targetRole: task.creator_id.role, backTo: "tasks" }}
                                                                className="text-dark/50 dark:text-light/50">
                                                                {`${task.creator_id.first_name} ${task.creator_id.last_name}`}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                    <div className="flex-1 flex flex-wrap flex-col items-start">
                                                        <p>
                                                            <span className=" text-dark dark:text-light mr-1">Updated At:</span>
                                                            <span className="text-dark/50 dark:text-light/50">{format(new Date(task.updatedAt), 'kk:mm dd/MM/yyyy')}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mx-2 flex flex-wrap justify-end items-center gap-2">
                                                    <div>
                                                        <button onClick={() => { handleOpenUpdate(task) }} title="Edit" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                            <FaEdit className="text-base" />
                                                        </button>
                                                        <button onClick={() => { deleteTaskSubmit(task._id) }} title="Delete" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                                            <FaTrash className="text-base" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div> :
                        <div className="min-h-[540px] pb-2 text-dark/50 dark:text-light/50 h-full flex justify-center items-center text-base animation duration-1000 slide-in-up">
                            <span>
                                <FaList className="inline mb-1 mr-2" />
                                No tasks found
                            </span>
                        </div>
            }
        </div>
    )
}
export default GetTasks
