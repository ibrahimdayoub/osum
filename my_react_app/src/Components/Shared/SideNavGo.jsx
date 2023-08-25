import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaBars, FaSignOutAlt, FaCrown, FaSpinner, FaUser, FaHome, FaBell, FaComment, FaChevronDown, FaChevronLeft, FaChevronRight, FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaLink, FaTrash, FaEdit, FaGithub, FaShieldAlt, FaLightbulb, FaList, FaSun, FaMoon, FaHeadset, FaCalendarAlt, FaChartBar } from "react-icons/fa";
import { getNotificationsCounter, addNotification, resetCounter } from "../../Redux/Features/Notifications/notificationsSlice";
import { addChatMessage, getMessagesCounter } from "../../Redux/Features/Messages/messagesSlice";
import { addChat, addChatLatestMeassage } from "../../Redux/Features/Chats/chatsSlice";
import { toggle } from "../../Redux/Features/Theme/themeSlice";
import { signOut } from "../../Redux/Features/Auth/authSlice";
import { io } from "socket.io-client";
import { set } from "../../Redux/Features/Socket/socketSlice";
import { Sidenav, initTE } from "tw-elements";
import { toastify } from "../../Helper";

const SideNavGo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const themeState = useSelector((state) => state.theme);
    const notificationsState = useSelector((state) => state.notifications);
    const messagesState = useSelector((state) => state.messages);
    const [isOpen, setIsOpen] = useState(true)
    const [socket, setSocket] = useState(null)
    const picURL = authState.auth.user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((authState.auth.user.picture_personal_profile).substring(7)).replace("\\", "/") : null
    const signOutSubmit = () => {
        dispatch(signOut())

        setTimeout(() => {
            navigate(0)
        }, 2500);
    }
    const clearNotificationsCounter = () => {
        if (location.pathname.split("/")[location.pathname.split("/").length - 1] === "notifications") {
            dispatch(resetCounter())
        }
    }
    useEffect(() => {
        initTE({ Sidenav });
        document
            .getElementById("slim-toggler")
            .addEventListener("click", () => {
                const instance = Sidenav.getInstance(
                    document.getElementById("sidenav-4")
                );
                instance.toggleSlim();
            });

        dispatch(getNotificationsCounter())
        dispatch(getMessagesCounter())

        const socket = io(process.env.REACT_APP_REAL_TIME_URL)
        socket.emit("addUser", { userId: authState.auth.user._id, userRole: authState.auth.user.role })
        setSocket(socket) //To this component  
        dispatch(set({ socket })) //To another components
    }, [])
    useEffect(() => {
        socket?.on("getNotification", (notification) => {
            dispatch(addNotification(
                {
                    notification: {
                        message: notification.message,
                        redirect: notification.redirect,
                        receivers: [{ receiver_id: authState.auth.user._id, is_new: true }], //to give it another background
                        createdAt: (new Date()).toISOString()
                    }
                }
            ))
        })
        socket?.on("getChat", (chat) => {
            dispatch(addChat(
                {
                    chat: { ...chat }
                    //or: chat
                }
            ))
        })
        socket?.on("getMessage", (message) => {
            dispatch(addChatMessage(
                {
                    message: { ...message }
                    //or: message
                }
            ))
            dispatch(addChatLatestMeassage(
                {
                    message: { ...message }
                    //or: message
                }
            ))
        })
    }, [socket])
    useEffect(() => {
        if ((Date.now() - authState.time < 100) && (authState.status === 401 || authState.status === 403) && authState.message) {
            toastify("error", authState.status, authState.message)
        }
        else if ((Date.now() - authState.time < 100) && authState.status === 500 && authState.message) {
            toastify("warn", authState.status, authState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [authState.status, authState.message])
    return (
        <div>
            {/* Sidenav */}
            <nav id="sidenav-4" className="bg-light dark:bg-dark bg-gradient-to-br from-queen/5 to-light dark:from-king/5 dark:to-dark border-r border-queen/25 dark:border-king/25 group fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full overflow-hidden data-[te-sidenav-slim='true']:hidden data-[te-sidenav-slim-collapsed='true']:w-[60px] data-[te-sidenav-slim='true']:w-[60px] data-[te-sidenav-hidden='false']:translate-x-0 [&[data-te-sidenav-slim-collapsed='true'][data-te-sidenav-slim='false']]:hidden [&[data-te-sidenav-slim-collapsed='true'][data-te-sidenav-slim='true']]:[display:unset]" data-te-sidenav-init data-te-sidenav-hidden="false" data-te-sidenav-mode="side" data-te-sidenav-slim="true" data-te-sidenav-content="#slim-content" data-te-sidenav-slim-collapsed="true">
                <h1 className="px-[0.15rem] mt-2" style={{ letterSpacing: 1 }}>
                    <Link to="home" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-10 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                        <FaCrown className="inline text-2xl mb-1" />
                        <span className="font-bold text-2xl ml-2 group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">OSUM</span>
                    </Link>
                </h1>
                <div className="text-queen dark:text-king ml-8 flex flex-col justify-center text-sm gap-1">
                    <Link to={`profile/${authState.auth.user._id}`} style={{ backgroundImage: `url(${picURL})` }} className="-ml-2 bg-cover bg-center relative my-2 w-24 h-24 rounded-full overflow-hidden shadow-sm shadow-queen dark:shadow-king group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">
                        {
                            !authState.auth.user.picture_personal_profile ?
                                <FaCrown className="text-6xl absolute top-4 left-4" /> :
                                null
                        }
                    </Link>
                    <span className="text-dark/75 dark:text-light/75 group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">{authState.auth.user.first_name} {authState.auth.user.last_name}</span>
                    <span className="text-dark/75 dark:text-light/75 group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">{authState.auth.user.email}</span>
                </div>
                {/*Break*/}
                <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                <ul onClick={() => { clearNotificationsCounter() }} data-te-sidenav-menu-ref className="relative m-0 list-none px-[0.2rem]">
                    {/*Profile Group*/}
                    {/* 
                        <li className="relative">
                            <div className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                                <FaUser className="mr-2 mb-1 text-xl" />
                                <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Profile</span>
                                <FaChevronDown className="absolute right-0 ml-auto mr-[0.5rem] transition-transform duration-500 ease-linear motion-reduce:transition-none text-md" data-te-sidenav-rotate-icon-ref />
                            </div>
                            <ul className="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block " data-te-sidenav-collapse-ref>
                                <li className="relative">
                                    <Link to={`profile/${authState.auth.user._id}?tab=update`} className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaEdit className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Update Profile</span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to={`profile/${authState.auth.user._id}?tab=delete`} className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaTrash className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Delete Profile</span>
                                    </Link>
                                </li>
                                <button onClick={() => { signOutSubmit() }} className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 w-full flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    {
                                        authState.isLoading && authState.operation === "signOut" ?
                                            <FaSpinner className="mr-2 mb-1 text-md animate-spin" /> :
                                            <FaSignOutAlt className="mr-2 mb-1 text-md" />
                                    }
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">SignOut</span>
                                </button>
                            </ul>
                        </li> 
                    */}
                    {/*Profile*/}
                    <li className="relative">
                        <Link to={`profile/${authState.auth.user._id}`} className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaUser className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Profile</span>
                        </Link>
                    </li>
                    {/*Home*/}
                    <li className="relative">
                        <Link to="home" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            {
                                authState.auth.user.role !== "Admin" ?
                                    <FaHome className="mr-2 mb-1 text-xl" /> :
                                    <FaChartBar className="mr-2 mb-1 text-xl" />
                            }
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">
                                {
                                    authState.auth.user.role !== "Admin" ?
                                        "Home" :
                                        "Dashboard"
                                }
                            </span>
                        </Link>
                    </li>
                    {/*Notifications*/}
                    <li className="relative">
                        <Link to="notifications" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaBell className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Notifications</span>
                        </Link>
                        {
                            (notificationsState.counter > 0) && (notificationsState.counter < 10) ?
                                <span className="text-light bg-queen dark:bg-king absolute top-0 right-2.5 w-5 h-5 p-0.5 rounded-full text-xs text-center">
                                    {notificationsState.counter}
                                </span> :
                                (notificationsState.counter > 0) && (notificationsState.counter >= 10) ?
                                    <span className="text-light bg-queen dark:bg-king absolute top-0 right-2.5 w-5 h-5 p-0.5 rounded-full text-xs text-center">
                                        +9
                                    </span> :
                                    null
                        }
                    </li>
                    {/*Messenger*/}
                    <li className="relative">
                        <Link to="messenger" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaComment className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Messenger</span>
                        </Link>
                        {
                            (messagesState.counter > 0) && (messagesState.counter < 10) ?
                                <span className="text-light bg-queen dark:bg-king absolute top-0 right-2.5 w-5 h-5 p-0.5 rounded-full text-xs text-center">
                                    {messagesState.counter}
                                </span> :
                                (messagesState.counter > 0) && (messagesState.counter >= 10) ?
                                    <span className="text-light bg-queen dark:bg-king absolute top-0 right-2.5 w-5 h-5 p-0.5 rounded-full text-xs text-center">
                                        +9
                                    </span> :
                                    null
                        }
                    </li>
                    {
                        authState.auth.user.role === "Developer" || authState.auth.user.role === "Delegate" ?
                            <>
                                {/*Teams*/}
                                <li className="relative">
                                    <Link to="teams" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                                        <FaHeadset className="mr-2 mb-1 text-xl" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Teams</span>
                                    </Link>
                                </li>
                                {/*Tasks*/}
                                <li className="relative">
                                    <Link to="tasks" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                                        <FaCalendarAlt className="mr-2 mb-1 text-xl" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Tasks</span>
                                    </Link>
                                </li>
                            </> :
                            null
                    }
                    {/*Break*/}
                    <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                    {/*Support Group*/}
                    {/* 
                        <li className="relative">
                            <div className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                                <FaShieldAlt className="mr-2 mb-1 text-xl" />
                                <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Support</span>
                                <FaChevronDown className="absolute right-0 ml-auto mr-[0.5rem] transition-transform duration-500 ease-linear motion-reduce:transition-none text-md" data-te-sidenav-rotate-icon-ref />
                            </div>
                            <ul className="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block " data-te-sidenav-collapse-ref>
                                <li className="relative">
                                    <Link to={`profile/${authState.auth.user._id}?tab=support`} className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaLightbulb className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Ask Matter</span>
                                    </Link>
                                </li>
                                <li className="relative">
                                    <Link to="support" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaList className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Show Records</span>
                                    </Link>
                                </li>
                            </ul>
                        </li> 
                    */}
                    {/*Support*/}
                    <li className="relative">
                        <Link to="support" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaShieldAlt className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">support</span>
                        </Link>
                    </li>
                    {/*Break*/}
                    <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                    {/*Social Media Group*/}
                    <li className="relative">
                        <div className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaLink className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Social Media</span>
                            <FaChevronDown className="absolute right-0 ml-auto mr-[0.5rem] transition-transform duration-500 ease-linear motion-reduce:transition-none text-md" data-te-sidenav-rotate-icon-ref />
                        </div>
                        <ul className="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block " data-te-sidenav-collapse-ref>
                            {/*Inner Link*/}
                            <li className="relative">
                                <a href="https://linkedin.com" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    <FaLinkedin className="mr-2 mb-1 text-md" />
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">LinkedIn</span>
                                </a>
                            </li>
                            {/*Inner Link*/}
                            <li className="relative">
                                <a href="https://twitter.com" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    <FaTwitter className="mr-2 mb-1 text-md" />
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Twitter</span>
                                </a>
                            </li>
                            {/*Inner Link*/}
                            <li className="relative">
                                <a href="https://instagram.com" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    <FaInstagram className="mr-2 mb-1 text-md" />
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Instagram</span>
                                </a>
                            </li>
                            {/*Inner Link*/}
                            {/*
                                <li className="relative">
                                    <Link className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaFacebook className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Facebook</span>
                                    </Link>
                                </li>
                            */}
                        </ul>
                    </li>

                    {/*Break*/}
                    <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                </ul>
            </nav>
            {/* Togglers */}
            <div id="slim-content" className="border-queen/25 dark:border-king/25 flex !pl-[77px] fixed border-b border-r rounded-b">
                {/* Toggler */}
                <button className={isOpen ? "text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-3 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" : "hidden"} aria-haspopup="true" id="slim-toggler">
                    <FaBars className="text-sm" />
                </button>
                {/* Toggler */}
                <button onClick={() => setIsOpen(!isOpen)} className="text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-3 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" data-te-sidenav-toggle-ref data-te-target="#sidenav-4" aria-controls="#sidenav-4" aria-haspopup="true">
                    {
                        isOpen ?
                            <FaChevronLeft className="text-sm" /> :
                            <FaChevronRight className="text-sm" />
                    }
                </button>
                {/* Toggler */}
                <button onClick={() => { dispatch(toggle()) }} className="text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-3 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" aria-haspopup="true">
                    {
                        themeState.theme === "dark" ?
                            <FaSun className="text-sm" /> :
                            <FaMoon className="text-sm" />
                    }
                </button>
            </div>
            <Outlet />
        </div>
    );
}
export default SideNavGo;