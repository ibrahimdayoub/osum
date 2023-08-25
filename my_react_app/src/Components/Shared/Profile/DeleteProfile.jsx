import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set } from "../../../Redux/Features/Auth/authSlice";
import { deleteUser } from '../../../Redux/Features/Users/usersSlice';
import { FaFireAlt, FaSpinner, FaTrash } from 'react-icons/fa'
import { toastify } from '../../../Helper';

const DeleteProfile = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const usersState = useSelector((state) => state.users);
    const [DeleteInput, setDeleteInput] = useState({
        code: "",
        error: false,
        role: user.role,
    });
    const handleDeleteInput = (e) => {
        e.persist();
        setDeleteInput({ ...DeleteInput, [e.target.name]: e.target.value });
    };
    const DeleteSubmit = (e) => {
        e.preventDefault();
        if (DeleteInput.code === user._id.substring(0, 6)) {
            const data = {
                role: DeleteInput.role
            }
            dispatch(deleteUser({ id: user._id, data }))
        }
        else {
            toastify("error", 400, "Code is not match")
            setDeleteInput({
                code: "",
                error: true,
                role: user.role,
            })
        }
    };
    useEffect(() => {
        if ((Date.now() - usersState.time < 100) && usersState.status === 200 && usersState.message && usersState.operation === "deleteUser") {
            toastify("success", usersState.status, usersState.message)
            dispatch(set({
                operation: "deleteUser"
            }))
        }
        else if ((Date.now() - usersState.time < 100) && (usersState.status === 400 || usersState.status === 401 || usersState.status === 403) && usersState.message && usersState.operation === "deleteUser") {
            toastify("error", usersState.status, usersState.message)
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 404 && usersState.message && usersState.operation === "deleteUser") {
            toastify("error", usersState.status, usersState.message)
            setDeleteInput({
                code: "",
                error: false,
                role: user.role,
            })
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 500 && usersState.message && usersState.operation === "deleteUser") {
            toastify("warn", usersState.status, usersState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [usersState.status, usersState.message])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner my-2 p-4 rounded animation duration-1000  slide-in-up">
            <h2 className="text-dark dark:text-light text-base">
                <FaTrash className="inline text-lg mb-1 mr-1" />
                Delete your profile:
            </h2>
            <form onSubmit={(e) => { DeleteSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <p className="text-dark dark:text-light my-1 ml-1">Type confirm code first:
                        <span className="text-dark/50 dark:text-light/50 text-sm p-1">{(user._id.substring(0, 6))}</span>
                    </p>
                    <div className="mb-1">
                        <label htmlFor="code" className="sr-only">
                            Code
                        </label>
                        <input
                            value={DeleteInput.code}
                            onChange={handleDeleteInput}
                            name="code"
                            type="text"
                            className={
                                DeleteInput.error ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={DeleteInput.error ? "Retype confirm code" : "Code"}
                        />
                    </div>
                    <div className="mb-1">
                        <select
                            className="placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                        >
                            <option value="">{DeleteInput.role}</option>
                        </select>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (usersState.isLoading && usersState.operation === "deleteUser") ? <FaSpinner className="text-xl animate-spin inline mr-1" /> :
                                <>
                                    <FaFireAlt className="inline text-xs mr-1 mb-0.5" />
                                    Confirm Departure
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default DeleteProfile