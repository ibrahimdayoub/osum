import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../../Redux/Features/Users/usersSlice';
import { createGroup } from '../../../Redux/Features/Chats/chatsSlice';
import { FaCrown, FaList, FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const AddGroupMessenger = ({ isOpenContacts, setSearchParams, setCurrentChat }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const usersState = useSelector((state) => state.users);
    const chatsState = useSelector((state) => state.chats);
    const [searchUserId, setSearchUserId] = useState("");
    const [groupName, setGroupName] = useState("");
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupPicture, setGroupPicture] = useState("");
    const handleGroupName = (e) => {
        e.persist();
        setGroupName(e.target.value)
    }
    const searchUserIdSubmit = (e) => {
        e.persist();
        setSearchUserId(e.target.value);
        const data = {
            key: e.target.value
        }
        dispatch(searchUsers(data))
    }
    const handleGroupUsers = (user) => {
        const userIsExists = groupUsers.some((groupUser) => {
            return groupUser._id === user._id
        })

        if (!userIsExists) {
            setGroupUsers([...groupUsers, user])
        }
        else {
            setGroupUsers(groupUsers.filter((groupUser) => {
                return groupUser._id !== user._id
            }))
        }
    }
    const handleGroupPicture = (e) => {
        const file = e.target.files[0];
        setGroupPicture(file);
    }
    const createGroupSubmit = (e) => {
        e.preventDefault();
        const usersIds = groupUsers.map((user) => {
            return user._id
        })
        const formData = new FormData();
        formData.append("group_name", groupName);
        formData.append("users_ids", usersIds);
        formData.append("group_picture", groupPicture);
        dispatch(createGroup(formData))
    }
    useEffect(() => {
        if ((Date.now() - chatsState.time < 100) && chatsState.status === 201 && chatsState.message && chatsState.operation === "createGroup") {
            toastify("success", chatsState.status, chatsState.message)
            setSearchUserId("")
            setGroupName("")
            setGroupUsers([])
            setGroupPicture("")
            setSearchParams("?tab=chat")
            setCurrentChat(chatsState.chats[0])
            //Add Chat (When Add Chat By Client, Developer, Delegate or Admin)
            socketState.socket.emit("addChat", { chat: chatsState.chats[0], user: authState.auth.user })
            //Add Notification (When Add Group Chat By Client, Developer, Delegate or Admin)
            socketState.socket.emit("addNotification", {
                receiversIds: chatsState.chats[0].users_ids.map((user)=>{return user._id}),
                redirect: "messenger",
                message: "There is a new group created, and you added as member in it",
            })
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 400 || chatsState.status === 401 || chatsState.status === 403) && chatsState.message && chatsState.operation === "createGroup") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "createGroup") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [chatsState.status, chatsState.message, chatsState.errors])
    return (
        <div className="text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1">
            <form encType="multipart/form-data" onSubmit={(e) => { createGroupSubmit(e) }}>
                <div>
                    <div className="mb-1">
                        <label htmlFor="group_name" className="sr-only">
                            Name
                        </label>
                        <input
                            value={groupName}
                            onChange={handleGroupName}
                            name="group_name"
                            className={
                                chatsState.errors && chatsState.errors.group_name && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={chatsState.errors && chatsState.errors.group_name && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ? chatsState.errors.group_name : "Name"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="users" className="sr-only">
                            Users
                        </label>
                        <input
                            value={searchUserId}
                            onChange={searchUserIdSubmit}
                            className={
                                chatsState.errors && chatsState.errors.users_ids && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={chatsState.errors && chatsState.errors.users_ids && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ? chatsState.errors.users_ids : "Users"}
                        />
                    </div>
                    <div className={
                        isOpenContacts ?
                            "mb-1 hidden xs:flex flex-wrap" :
                            "mb-1 hidden sm:flex flex-wrap"
                    }>
                        {
                            groupUsers.map((user) => {
                                return (
                                    <span
                                        onClick={() => { handleGroupUsers(user) }}
                                        className="bg-queen dark:bg-king text-light text-xs py-1 px-2 rounded m-1 cursor-pointer hover:opacity-75 duration-500 transition-opacity"
                                    >
                                        <FaTimes className="inline mr-1" />{`${user.first_name} ${user.last_name}`}
                                    </span>
                                )
                            })
                        }
                    </div>
                    {usersState.users.length !== 0 && searchUserId.length !== 0 ?
                        <div>
                            {
                                usersState.users.map((user) => {
                                    return (
                                        <div
                                            onClick={() => { handleGroupUsers(user) }}
                                            className={
                                                isOpenContacts ?
                                                    "xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer" :
                                                    "sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer"
                                            }>
                                            <div
                                                style={{ backgroundImage: `url(${user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((user.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden ">
                                                {
                                                    !user.picture_personal_profile ?
                                                        <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                                        null
                                                }
                                            </div>
                                            <div className={
                                                isOpenContacts ?
                                                    "w-3/4  hidden xs:flex-1 xs:flex flex-col" :
                                                    "w-3/4  hidden sm:flex-1 sm:flex flex-col"
                                            }>
                                                <div className="w-full flex items-center text-left">
                                                    <span className={
                                                        !groupUsers.some(groupUser => groupUser._id === user._id) ?
                                                            "text-dark dark:text-light flex-1 text-sm truncate w-2" :
                                                            "text-queen dark:text-king flex-1 text-sm truncate w-2"
                                                    }>{`${user.first_name} ${user.last_name}`}</span>
                                                </div>

                                                <div className="w-full flex items-center text-left">
                                                    <span className={
                                                        !groupUsers.some(groupUser => groupUser._id === user._id) ?
                                                            "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                            "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                    }>{user.role}</span>
                                                </div>
                                                <div className="w-full flex items-center text-left">
                                                    <span className={
                                                        !groupUsers.some(groupUser => groupUser._id === user._id) ?
                                                            "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                            "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                    }>{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div> :
                        usersState.users.length === 0 && searchUserId.length !== 0 ?
                            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2 max-w-4xl ml-auto">
                                <FaList className="inline mb-1 mr-2" />
                                No users found
                            </div> :
                            null
                    }
                    <div className="mb-1">
                        <label htmlFor="group_picture"
                            className={
                                chatsState.errors && chatsState.errors.group_picture && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                        >
                            {
                                chatsState.errors && chatsState.errors.group_picture && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ?
                                    chatsState.errors.group_picture :
                                    groupPicture && groupPicture.name ?
                                        <span className="text-dark/50 dark:text-light/50">{groupPicture.name}</span> :
                                        <span className="text-dark/50 dark:text-light/50">Picture</span>
                            }
                        </label>
                        <input
                            onChange={handleGroupPicture}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="group_picture"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                >
                    {
                        chatsState.isLoading && (chatsState.operation === "createGroup" || chatsState.operation === "updateGroup") ? <FaSpinner className="inline text-xl animate-spin" /> :
                            <>
                                <FaPlus className="inline text-xs mr-1 mb-0.5" />
                                {
                                    isOpenContacts ?
                                        <span className="inline text-xs md:text-sm">Create Group {groupUsers.length > 0 ? `(${groupUsers.length})` : null}</span> :
                                        <span className="hidden sm:inline text-xs md:text-sm">Create Group {groupUsers.length > 0 ? `(${groupUsers.length})` : null}</span>
                                }
                            </>
                    }
                </button>
            </form>
        </div>
    )
}
export default AddGroupMessenger