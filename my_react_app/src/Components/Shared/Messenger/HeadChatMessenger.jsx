import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteChat, leaveChat, leaveGroup } from '../../../Redux/Features/Chats/chatsSlice';
import { FaCrown, FaDoorOpen, FaEdit, FaTrash } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const HeadChatMessenger = ({ currentChat, setCurrentChat, setUpdatedChat, setSearchParams }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const chatsState = useSelector((state) => state.chats);
    const handleOpenUpdate = (groupId) => {
        setUpdatedChat(groupId)
        setSearchParams("?tab=contacts")
    }
    const deleteChatSubmit = (chatId) => {
        const data = {
            "chat_id": chatId,
        }
        dispatch(deleteChat(data))
    }
    const leaveChatSubmit = (groupId) => {
        const data = {
            user_id: authState.auth.user._id
        }
        dispatch(leaveChat({ id: groupId, data }))
    }
    const leaveGroupSubmit = (groupId) => {
        const data = {
            user_id: authState.auth.user._id
        }
        dispatch(leaveGroup({ id: groupId, data }))
    }
    useEffect(() => {
        if ((Date.now() - chatsState.time < 100) && chatsState.status === 200 && chatsState.message && chatsState.operation === "deleteChat") {
            toastify("success", chatsState.status, chatsState.message)
            setCurrentChat("")
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 400 || chatsState.status === 401 || chatsState.status === 403) && chatsState.message && chatsState.operation === "deleteChat") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "deleteChat") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - chatsState.time < 100) && chatsState.status === 200 && chatsState.message && chatsState.operation === "leaveChat") {
            toastify("success", chatsState.status, chatsState.message)
            setCurrentChat("")
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 400 || chatsState.status === 401 || chatsState.status === 403) && chatsState.message && chatsState.operation === "leaveChat") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "leaveChat") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - chatsState.time < 100) && chatsState.status === 200 && chatsState.message && chatsState.operation === "leaveGroup") {
            toastify("success", chatsState.status, chatsState.message)
            setCurrentChat("")
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 400 || chatsState.status === 401 || chatsState.status === 403) && chatsState.message && chatsState.operation === "leaveGroup") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "leaveGroup") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [chatsState.status, chatsState.message, chatsState.errors])
    return (
        <div className="border-queen/50 dark:border-king/50 border-b flex flex-wrap justify-between items-center px-4 py-2">
            {/*Image & Name*/}
            <div className="flex flex-wrap justify-between items-center gap-2">
                {/*Image*/}
                {
                    currentChat && !currentChat.is_group ?
                        <div
                            style={{ backgroundImage: `url(${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + (((currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                            {
                                !(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].picture_personal_profile ?
                                    <FaCrown className="text-2xl absolute top-4 left-4" /> :
                                    null
                            }
                        </div> :
                        currentChat && currentChat.is_group ?
                            <div
                                style={{ backgroundImage: `url(${currentChat.chat_picture ? process.env.REACT_APP_BACK_END_URL + ((currentChat.chat_picture).substring(7)).replace("\\", "/") : null})` }}
                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                                {
                                    !currentChat.chat_picture ?
                                        <FaCrown className="text-2xl absolute top-4 left-4" /> :
                                        null
                                }
                            </div> :
                            <div
                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                                <FaCrown className="text-2xl absolute top-4 left-4" />
                            </div>
                }
                {/*Name*/}
                <div className="flex flex-col">
                    {
                        currentChat && !currentChat.is_group ?
                            <Link to={currentChat && !currentChat.is_group && authState.auth.user.role !== "Admin" && (currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].role !== "Admin" ? `../profile/${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0]._id}` : null} state={{ backTo: "messenger" }} className="text-sm sm:text-lg text-dark dark:text-light">
                                {
                                    (currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].role === "Admin"?
                                        `${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].first_name} ${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].last_name} (Admin)` :
                                        `${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].first_name} ${(currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id }))[0].last_name}`
                                }
                            </Link> :
                            currentChat && currentChat.is_group ?
                                <span className="text-sm sm:text-lg text-dark dark:text-light">{currentChat.chat_name}</span>
                                :
                                <span className="text-sm sm:text-lg text-dark dark:text-light">Reciver Name</span>
                    }
                    <span className="text-xs text-queen dark:text-king">
                        {
                            currentChat ?
                                "Online now" :
                                "Offline now"
                        }
                    </span>
                </div>
            </div>
            {/*Options*/}
            <div className="flex flex-wrap gap-1 mr-2">
                {
                    currentChat && !currentChat.is_group && currentChat.owner_id._id === authState.auth.user._id ?
                        <button title="Delete" onClick={() => deleteChatSubmit(currentChat._id)} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                            <FaTrash className="text-base" />
                        </button> :
                        currentChat && !currentChat.is_group && currentChat.owner_id._id !== authState.auth.user._id ?
                            <button title="Leave" onClick={() => { leaveChatSubmit(currentChat._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                <FaDoorOpen className="text-base" />
                            </button> :
                            currentChat && currentChat.is_group && currentChat.owner_id._id === authState.auth.user._id ?
                                <>
                                    <button title="Edit" onClick={() => { handleOpenUpdate(currentChat._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                        <FaEdit className="text-base" />
                                    </button>
                                    <button title="Delete" onClick={() => deleteChatSubmit(currentChat._id)} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                        <FaTrash className="text-base" />
                                    </button>
                                </> :
                                currentChat && currentChat.is_group && currentChat.owner_id._id !== authState.auth.user._id ?
                                    <button title="Leave" onClick={() => { leaveGroupSubmit(currentChat._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                        <FaDoorOpen className="text-base" />
                                    </button> :
                                    null
                }
            </div>
        </div>
    )
}
export default HeadChatMessenger