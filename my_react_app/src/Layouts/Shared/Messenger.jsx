import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getChats } from "../../Redux/Features/Chats/chatsSlice";
import { getMessagesCounter } from "../../Redux/Features/Messages/messagesSlice";
import { FaChevronDown, FaComments, FaUsers, FaChevronRight, FaSearchPlus, FaSearchLocation } from "react-icons/fa";
import { Tab, Dropdown, Ripple, initTE } from "tw-elements";
import Container from "../../Components/Shared/Container";
import AddGroupMessenger from "../../Components/Shared/Messenger/AddGroupMessenger";
import UpdateGroupMessenger from "../../Components/Shared/Messenger/UpdateGroupMessenger";
import SearchContactMessenger from "../../Components/Shared/Messenger/SearchContactMessenger";
import GetChatsMessenger from "../../Components/Shared/Messenger/GetChatsMessenger";
import GetGroupsMessenger from "../../Components/Shared/Messenger/GetGroupsMessenger";
import HeadChatMessenger from "../../Components/Shared/Messenger/HeadChatMessenger";
import MessagesChatMessenger from "../../Components/Shared/Messenger/MessagesChatMessenger";
import SendChatMessenger from "../../Components/Shared/Messenger/SendChatMessenger";
import { toastify } from "../../Helper";

const Messenger = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toBottomChatRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const chatsState = useSelector((state) => state.chats);
    const messagesState = useSelector((state) => state.messages);
    const [isOpenChat, setIsOpenChat] = useState(false);
    const [isOpenContacts, setIsOpenContacts] = useState(false);
    const [updatedChat, setUpdatedChat] = useState("");
    const [currentChat, setCurrentChat] = useState("");
    const [latestMessage, setLatestMessage] = useState("");
    const handleShow = () => {
        if (searchParams.get("tab") === null) {
            setSearchParams("?tab=chat")
        }
        else if (searchParams.get("tab") === "chat") {
            setSearchParams("?tab=contacts")
        }
        else if (searchParams.get("tab") === "contacts") {
            setSearchParams("")
        }
    }
    useEffect(() => {
        initTE({ Tab, Dropdown, Ripple });
        toBottomChatRef.current?.scrollIntoView({ behavior: "smooth" })
    }, []) 
    useEffect(() => {
        if (searchParams.get("tab") === "chat") {
            setIsOpenChat(true); setIsOpenContacts(false);
        }
        else if (searchParams.get("tab") === "contacts") {
            setIsOpenChat(false); setIsOpenContacts(true);
        }
        else {
            setIsOpenChat(false); setIsOpenContacts(false);
        }
    }, [searchParams])
    useEffect(() => {
        toBottomChatRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messagesState])
    useEffect(() => {
        // setTimeout(() => {
        dispatch(getChats())
        // }, 100)
        setLatestMessage("")
        if (isOpenContacts) {
            setSearchParams("?tab=chat")
        }
        setUpdatedChat("")
    }, [currentChat])
    useEffect(() => {
        if ((Date.now() - chatsState.time < 100) && chatsState.status === 200 && chatsState.message && chatsState.operation === "getChats") {
            toastify("success", chatsState.status, chatsState.message)
            dispatch(getMessagesCounter())
        }
        else if ((Date.now() - chatsState.time < 100) && (chatsState.status === 401 || chatsState.status === 403 || chatsState.status === 404) && chatsState.message && chatsState.operation === "getChats") {
            toastify("error", chatsState.status, chatsState.message)
        }
        else if ((Date.now() - chatsState.time < 100) && chatsState.status === 500 && chatsState.message && chatsState.operation === "getChats") {
            toastify("warn", chatsState.status, chatsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [chatsState.status, chatsState.message, chatsState.errors])
    return (
        <Container>
            {/*Head*/}
            <div className="text-dark/75 dark:text-light/75 mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
                {/*Title*/}
                <h1 className="flex-1" style={{ letterSpacing: "2px" }}>MESSENGER</h1>
            </div>
            {/* Add Group && Update Group && Search Contact && Chats && Groups && Chat*/}
            <div className="flex gap-2 relative">
                {
                    isOpenContacts || (!isOpenChat && !isOpenContacts) ?
                        <>
                            {/* Add Group && Update Group && Search Contact && Chats && Groups */}
                            <div className={
                                isOpenContacts ?
                                    "bg-dark/[0.025] dark:bg-light/[0.025] relative flex-1 text-xl text-center rounded animation duration-1000 slide-in-left" :
                                    "bg-dark/[0.025] dark:bg-light/[0.025] relative w-20 sm:w-60 lg:w-80 text-xl text-center rounded animation duration-1000 slide-in-left"
                            }>
                                {
                                    isOpenContacts ?
                                        <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                        null
                                }
                                <ul className="text-dark/50 dark:text-light/50 mb-3 text-xs sm:text-base list-none flex flex-row flex-wrap" role="tablist" data-te-nav-ref>
                                    <li role="presentation" className={
                                        isOpenContacts ?
                                            "w-full xs:w-1/3" :
                                            "w-full sm:w-1/3"
                                    }>
                                        <a id="tab-contacts-new" href="#tab-contacts-new-content" className={
                                            isOpenContacts ?
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                                        } data-te-toggle="pill" data-te-target="#tab-contacts-new-content" role="tab" aria-controls="tab-contacts-new-content" data-te-nav-active aria-selected="true">
                                            {
                                                updatedChat ?
                                                    <FaSearchLocation className={
                                                        isOpenContacts ?
                                                            "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                            "text-xs sm:text-base inline mb-0.5 mx-1"
                                                    } /> :
                                                    <FaSearchPlus className={
                                                        isOpenContacts ?
                                                            "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                            "text-xs sm:text-base inline mb-0.5 mx-1"
                                                    } />
                                            }
                                            <span className={
                                                isOpenContacts ?
                                                    "hidden xs:inline" :
                                                    "hidden md:inline"
                                            }>{
                                                    updatedChat ?
                                                        "Update" :
                                                        "New"
                                                }</span>
                                        </a>
                                    </li>
                                    <li role="presentation" className={
                                        isOpenContacts ?
                                            "w-full xs:w-1/3" :
                                            "w-full sm:w-1/3"
                                    }>
                                        <a id="tab-contacts-chats" href="#tab-contacts-chats-content" className={
                                            isOpenContacts ?
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                                        } data-te-toggle="pill" data-te-target="#tab-contacts-chats-content" role="tab" aria-controls="tab-contacts-chats-content" aria-selected="false">
                                            <FaComments className={
                                                isOpenContacts ?
                                                    "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                    "text-xs sm:text-base inline mb-0.5 mx-1"
                                            } />
                                            <span className={
                                                isOpenContacts ?
                                                    "hidden xs:inline" :
                                                    "hidden md:inline"
                                            }>Chats</span>
                                        </a>
                                    </li>
                                    <li role="presentation" className={
                                        isOpenContacts ?
                                            "w-full xs:w-1/3" :
                                            "w-full sm:w-1/3"
                                    }>
                                        <a id="tab-contacts-groups" href="#tab-contacts-groups-content" className={
                                            isOpenContacts ?
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                                        } data-te-toggle="pill" data-te-target="#tab-contacts-groups-content" role="tab" aria-controls="tab-contacts-groups-content" aria-selected="false">
                                            <FaUsers className={
                                                isOpenContacts ?
                                                    "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                    "text-xs sm:text-base inline mb-0.5 mx-1"
                                            } />
                                            <span className={
                                                isOpenContacts ?
                                                    "hidden xs:inline" :
                                                    "hidden md:inline"
                                            }>Groups</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="mb-4">
                                    {/* Add Group && Update Group && Search Contact */}
                                    <div id="tab-contacts-new-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="" data-te-tab-active>
                                        {/* Add Group && Update Group */}
                                        {
                                            updatedChat ?
                                                <UpdateGroupMessenger isOpenContacts={isOpenContacts} setSearchParams={setSearchParams} currentChat={currentChat} setCurrentChat={setCurrentChat} updatedChat={updatedChat} setUpdatedChat={setUpdatedChat} /> :
                                                <AddGroupMessenger isOpenContacts={isOpenContacts} setSearchParams={setSearchParams} setCurrentChat={setCurrentChat} />
                                        }
                                        {/* Search Contact */}
                                        {
                                            !updatedChat ?
                                                <SearchContactMessenger isOpenContacts={isOpenContacts} setSearchParams={setSearchParams} setCurrentChat={setCurrentChat} /> :
                                                null
                                        }
                                    </div>
                                    {/*Chats*/}
                                    <div id="tab-contacts-chats-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                                        <GetChatsMessenger isOpenContacts={isOpenContacts} currentChat={currentChat} setCurrentChat={setCurrentChat} latestMessage={latestMessage} />
                                    </div>
                                    {/*Groups*/}
                                    <div id="tab-contacts-groups-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                                        <GetGroupsMessenger isOpenContacts={isOpenContacts} currentChat={currentChat} setCurrentChat={setCurrentChat} latestMessage={latestMessage} />
                                    </div>
                                </div>
                            </div>
                        </> :
                        null
                }
                {
                    isOpenChat || (!isOpenChat && !isOpenContacts) ?
                        <>
                            {/*Chat*/}
                            <div className="bg-dark/[0.025] dark:bg-light/[0.025] relative h-[675px] max-h-[675px] flex-1 text-xl rounded-md animation duration-1000 slide-in-right">
                                {/*Toggle Button*/}
                                {
                                    isOpenChat ?
                                        <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                        (!isOpenChat && !isOpenContacts) ?
                                            <button onClick={handleShow} className="absolute -left-4 top-7 cursor-pointer z-[1000]"><FaChevronDown className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                            null
                                }
                                {/*Head*/}
                                <HeadChatMessenger currentChat={currentChat} setCurrentChat={setCurrentChat} setUpdatedChat={setUpdatedChat} setSearchParams={setSearchParams} />
                                {/*Messages*/}
                                <MessagesChatMessenger isOpenChat={isOpenChat} currentChat={currentChat} toBottomChatRef={toBottomChatRef} />
                                {/*Send*/}
                                <SendChatMessenger currentChat={currentChat} setLatestMessage={setLatestMessage} />
                            </div>
                        </> :
                        null
                }
            </div >
        </Container >
    )
}
export default Messenger