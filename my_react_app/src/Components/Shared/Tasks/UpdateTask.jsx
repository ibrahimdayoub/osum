import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../../../Redux/Features/Tasks/tasksSlice';
import { FaEdit, FaSpinner } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const UpdateTask = ({ isOpenProjects, setSearchParams, currentTask, setUpdatedTask }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tasksState = useSelector((state) => state.tasks);
    const [taskInput, setTaskInput] = useState({
        content: currentTask.content,
    });
    const handleTaskInput = (e) => {
        e.persist();
        setTaskInput({ ...taskInput, [e.target.name]: e.target.value });
    };
    const updateTaskSubmit = (e) => {
        e.preventDefault()
        const data = {
            content: taskInput.content,
        }
        dispatch(updateTask({ id: currentTask._id, data }))
    }
    useEffect(() => {
        if ((Date.now() - tasksState.time < 100) &&tasksState.status === 200 && tasksState.message && tasksState.operation === "updateTask") {
            toastify("success", tasksState.status, tasksState.message)
            setTaskInput({
                content: "",
            })
            setSearchParams("?tab=tasks")
            setUpdatedTask("")
        }
        else if ((Date.now() - tasksState.time < 100) &&(tasksState.status === 400 || tasksState.status === 401 || tasksState.status === 403 || tasksState.status === 404) && tasksState.message && tasksState.operation === "updateTask") {
            toastify("error", tasksState.status, tasksState.message)
        }
        else if ((Date.now() - tasksState.time < 100) &&tasksState.status === 500 && tasksState.message && tasksState.operation === "updateTask") {
            toastify("warn", tasksState.status, tasksState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [tasksState.status, tasksState.message, tasksState.errors])
    return (
        <div className="text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1">
            <form encType="multipart/form-data" onSubmit={(e) => { updateTaskSubmit(e) }}>
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
                                tasksState.errors && tasksState.errors.content && tasksState.operation === "updateTask" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={tasksState.errors && tasksState.errors.content && tasksState.operation === "updateTask" ? tasksState.errors.content : "Content"}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                >
                    {
                        tasksState.isLoading && tasksState.operation === "updateTask" ? <FaSpinner className="inline text-xl animate-spin" /> :
                            <>
                                <FaEdit className="inline text-xs mr-1 mb-0.5" />
                                {
                                    isOpenProjects ?
                                        <span className="inline text-xs md:text-sm">Update Task </span> :
                                        <span className="hidden sm:inline text-xs md:text-sm">Update Task</span>
                                }
                            </>
                    }
                </button>
            </form>
        </div>
    )
}
export default UpdateTask