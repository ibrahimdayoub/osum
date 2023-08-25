import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../../Redux/Features/Users/usersSlice';
import { accessChat } from '../../../Redux/Features/Chats/chatsSlice';
import { FaCrown, FaList, FaSearch } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const SearchContactMessenger = ({ isOpenContacts, setSearchParams, setCurrentChat }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const usersState = useSelector((state) => state.users);
    const chatsState = useSelector((state) => state.chats);
    const [search, setSearch] = useState("");
    const [clicked, setClicked] = useState(false);
    const searchSubmit = () => {
        const data = {
            key: search
        }
        dispatch(searchUsers(data))
    }
    const accessChatSubmit = (userRole, userId) => {
        const data = {
            "target_role": userRole,
            "target_id": userId
        }
        dispatch(accessChat(data))
    }
    useEffect(() => {
        if ((Date.now() - chatsState.time < 100) && (chatsState.status === 200 || chatsState.status === 201) && chatsState.message && chatsState.operation === "accessChat") {
            toastify("success", chatsState.status, chatsState.message)
            setSearch("")
            setSearchParams("?tab=chat")
            setCurrentChat(chatsState.chats[0])
            if (chatsState.status === 201) {
                //Add Chat (When Add Chat By Client, Developer, Delegate or Admin)
                socketState.socket.emit("addChat", { chat: chatsState.chats[0], user: authState.auth.user })
            }
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 400 || chatsState.status === 401 || chatsState.status === 403) && chatsState.message && chatsState.operation === "accessChat") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "accessChat") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [chatsState.status, chatsState.message, chatsState.errors])
    return (
        <div className='mr-1 ml-2'>
            <div className="text-dark dark:text-light border-dark/50 dark:border-light/50 flex items-center border-b ml-1 mb-2">
                <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value);; setClicked(false) }}
                    name="search"
                    className=" placeholder:text-dark/50 dark:placeholder:text-light/50 bg-transparent flex-1 p-1.5 pr-0.5 focus:outline-none text-xs sm:text-sm"
                    placeholder="User"
                />
            </div>
            {
                usersState.users.length !== 0 && search.length !== 0 && clicked ?
                    <>
                        {
                            usersState.users.map((user) => {
                                return (
                                    <div
                                        onClick={() => { accessChatSubmit(user.role, user._id) }}
                                        className={
                                            isOpenContacts ?
                                                "xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer" :
                                                "sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer"
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
                                                <span className="text-dark dark:text-light flex-1 text-sm truncate w-2">{`${user.first_name} ${user.last_name}`}</span>
                                            </div>
                                            <div className="w-full flex items-center text-left">
                                                <span className="text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2">{user.role}</span>
                                            </div>
                                            <div className="w-full flex items-center text-left">
                                                <span className="text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2">{user.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </> :
                    usersState.users.length === 0 && search.length !== 0 && clicked ?
                        <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2 max-w-4xl ml-auto">
                            <FaList className="inline mb-1 mr-2" />
                            No users found
                        </div> :
                        null
            }
            < button
                onClick={() => { searchSubmit(); setClicked(true) }}
                type="button"
                className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-4 rounded-md mb-2"
            >
                <FaSearch className="inline text-xs mr-1 mb-0.5" />
                {
                    isOpenContacts ?
                        <span className="inline text-xs md:text-sm">Search Contact</span> :
                        <span className="hidden sm:inline text-xs md:text-sm">Search Contact</span>
                }
            </button >
        </div>
    )
}
export default SearchContactMessenger