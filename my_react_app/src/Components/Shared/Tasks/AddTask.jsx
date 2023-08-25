import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../../Redux/Features/Tasks/tasksSlice';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const AddTask = ({ isOpenProjects, projectId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const tasksState = useSelector((state) => state.tasks);
    const [taskInput, setTaskInput] = useState({
        content: "",
    });
    const handleTaskInput = (e) => {
        e.persist();
        setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
    };
    const addTaskSubmit = (e) => {
        e.preventDefault()
        const data = {
            content: taskInput.content,
            project_id: projectId
        }
        if (!projectId) {
            toastify("error", 400, "You have to select project")
        }
        else {
            dispatch(addTask({ data }))
        }
    }
    useEffect(() => {
        if ((Date.now() - tasksState.time < 100) && tasksState.status === 201 && tasksState.message && tasksState.operation === "addTask") {
            toastify("success", tasksState.status, tasksState.message)
            setTaskInput({
                content: "",
            })
            if (tasksState.tasks[0].project_id.team_id) {
                const receiversIds = tasksState.tasks[0].project_id.team_id.members_ids.filter((memberId) => {
                    return memberId !== tasksState.tasks[0].creator_id._id
                })
                //Add Notification (When Add Task By Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: receiversIds,
                    redirect: `tasks`,
                    message: `There is a new task created, and you added as member in it`,
                })
            }
        }
        else if ((Date.now() - tasksState.time < 100) && (tasksState.status === 400 || tasksState.status === 401 || tasksState.status === 403 || tasksState.status === 404) && tasksState.message && tasksState.operation === "addTask") {
            toastify("error", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) && tasksState.status === 500 && tasksState.message && tasksState.operation === "addTask") {
            toastify("warn", tasksState.status, tasksState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [tasksState.status, tasksState.message, tasksState.errors])
    return (
        <div className="text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1">
            <form encType="multipart/form-data" onSubmit={(e) => { addTaskSubmit(e) }}>
                <div>
                    <div className="mb-1">
                        <label htmlFor="content" className="sr-only">
                            Content
                        </label>
                        <input
                            value={taskInput.content}
                            onChange={handleTaskInput}
                            name="content"
                            className={
                                tasksState.errors && tasksState.errors.content && tasksState.operation === "addTask" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={tasksState.errors && tasksState.errors.content && tasksState.operation === "addTask" ? tasksState.errors.content : "Content"}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                >
                    {
                        tasksState.isLoading && tasksState.operation === "addTask" ? <FaSpinner className="inline text-xl animate-spin" /> :
                            <>
                                <FaPlus className="inline text-xs mr-1 mb-0.5" />
                                {
                                    isOpenProjects ?
                                        <span className="inline text-xs md:text-sm">Create Task </span> :
                                        <span className="hidden sm:inline text-xs md:text-sm">Create Task</span>
                                }
                            </>
                    }
                </button>
            </form>
        </div>
    )
}
export default AddTask