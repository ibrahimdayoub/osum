import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addSupport } from '../../../Redux/Features/Supports/supportsSlice';
import { FaLightbulb, FaList, FaShieldAlt, FaSpinner } from 'react-icons/fa'
import { toastify } from '../../../Helper';

const SupportProfile = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const supportsState = useSelector((state) => state.supports);
    const socketState = useSelector((state) => state.socket);
    const [SupportInput, setSupportInput] = useState({
        subject: "",
        message: ""
    });
    const handleSupportInput = (e) => {
        e.persist();
        setSupportInput({ ...SupportInput, [e.target.name]: e.target.value });
    };
    const SupportSubmit = (e) => {
        e.preventDefault();
        const data = {
            subject: SupportInput.subject,
            message: SupportInput.message,
        }
        dispatch(addSupport({ data }))
    }
    useEffect(() => {
        if ((Date.now() - supportsState.time < 100) && supportsState.status === 201 && supportsState.message && supportsState.operation === "addSupport") {
            toastify("success", supportsState.status, supportsState.message)
            setSupportInput({
                subject: "",
                message: ""
            })
            //Add Notification (When Add Support By Client, Developer, Delegate or Admin)
            socketState.socket.emit("addNotification", {
                receiversIds: "Admins",
                redirect: "support",
                message: `There is an ${(user.role).toLowerCase()} requesting support, please respond to their inquiry`,
            })
        }
        else if ((Date.now() - supportsState.time < 100) && (supportsState.status === 400 || supportsState.status === 401 || supportsState.status === 403) && supportsState.message && supportsState.operation === "addSupport") {
            toastify("error", supportsState.status, supportsState.message)
        }
        else if ((Date.now() - supportsState.time < 100) && supportsState.status === 500 && supportsState.message && supportsState.operation === "addSupport") {
            toastify("warn", supportsState.status, supportsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [supportsState.status, supportsState.message])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner my-2 p-4 rounded animation duration-1000 slide-in-up">
            <h2 className="text-dark dark:text-light text-base">
                <FaShieldAlt className="inline text-lg mb-1 mr-1" />
                Contact with support:
            </h2>
            <form onSubmit={(e) => { SupportSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1">
                        <label htmlFor="subject" className="sr-only">
                            Subject
                        </label>
                        <input
                            value={SupportInput.subject}
                            onChange={handleSupportInput}
                            name="subject"
                            type="text"
                            className={
                                supportsState.errors && supportsState.errors.subject && supportsState.operation === "addSupport" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={supportsState.errors && supportsState.errors.subject ? supportsState.errors.subject : "Subject"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="message" className="sr-only">
                            Message
                        </label>
                        <textarea
                            value={SupportInput.message}
                            onChange={handleSupportInput}
                            rows={1}
                            name="message"
                            type="text"
                            className={
                                supportsState.errors && supportsState.errors.message && supportsState.operation === "addSupport" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={supportsState.errors && supportsState.errors.message ? supportsState.errors.message : "Message"}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-1">
                    <Link to={`/${(user.role).toLowerCase()}/support`} className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        <FaList className="inline text-xs mr-2" />
                        Show Records
                    </Link>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (supportsState.isLoading && supportsState.operation === "addSupport") ? <FaSpinner className="text-xl animate-spin inline mr-1" /> :
                                <>
                                    <FaLightbulb className="inline text-xs mr-2 mb-0.5" />
                                    Ask Matter
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default SupportProfile