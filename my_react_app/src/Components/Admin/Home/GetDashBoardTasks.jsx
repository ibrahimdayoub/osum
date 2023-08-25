import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, getDashboardTasks } from "../../../Redux/Features/Tasks/tasksSlice";
import { FaSpinner, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const GetDashBoardTasks = ({ setCounter, keyword }) => {
    const dispatch = useDispatch();
    const tasksState = useSelector((state) => state.tasks);
    const [searchResults, setSearchResults] = useState(null)
    const deleteTaskSubmit = (taskId) => {
        dispatch(deleteTask({ id: taskId }))
    }
    useEffect(() => {
        dispatch(getDashboardTasks())
    }, [])
    useEffect(() => {
        const regex = new RegExp(keyword, "i")
        setSearchResults(
            tasksState.tasks.filter((task) => {
                return regex.test(task.content) || regex.test(task.project_id.project_name)
            })
        )
    }, [keyword])
    useEffect(() => {
        setCounter(searchResults?.length ? searchResults.length : tasksState.tasks.length)
    }, [searchResults])
    return (
        (searchResults?.length > 0 ? searchResults : tasksState.tasks).map((task) => {
            return (
                <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm p-2 rounded-md mb-2">
                    <p className="mx-2 text-justify border-b pb-1 border-queen/50 dark:border-king/50">
                        <span className="text-dark/50 dark:text-light/50">{task.content}</span>
                    </p>
                    <div>
                        <div className="mx-2 lg:flex flex-wrap justify-between items-center pt-1">
                            <div className="flex-1 flex flex-wrap flex-col items-start">
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Project Name:</span>
                                    <span className="text-dark/50 dark:text-light/50">{task.project_id.project_name}</span>
                                </p>
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Task Creator:</span>
                                    <span className="text-dark/50 dark:text-light/50"> {`${task.creator_id.first_name} ${task.creator_id.last_name}`}</span>
                                </p>
                            </div>
                            <div className="flex-1 flex flex-wrap flex-col items-start">
                                <p>
                                    <span className=" text-dark dark:text-light mr-1">Updated At:</span>
                                    <span className="text-dark/50 dark:text-light/50">{format(new Date(task.updatedAt), 'kk:mm dd/MM/yyyy')}</span>
                                </p>
                                <button onClick={() => { deleteTaskSubmit(task._id) }} title="Delete" className="mt-2">
                                    <FaTrash className="text-lg text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    )
}
export default GetDashBoardTasks