import { useSelector } from 'react-redux';
import { FaCrown } from 'react-icons/fa';
import { format } from 'date-fns';

const GetGroupsMessenger = ({ isOpenContacts, currentChat, setCurrentChat, latestMessage }) => {
    const chatsState = useSelector((state) => state.chats);
    return (
        (chatsState.chats.filter((chat) => { return chat.is_group && chat.users_ids.length > 1 })).length === 0 ?
            <div className="text-dark/50 dark:text-light/50 text-center text-xs sm:text-lg px-4 py-10 h-full">
                Create group to contact...
            </div> :
            <>
                {
                    chatsState.chats.map((chat) => {
                        return chat.is_group && chat.users_ids.length > 1 && (
                            <div onClick={() => { setCurrentChat(chat) }} className={
                                isOpenContacts ?
                                    `${chat._id === currentChat._id ? "border border-queen/25 dark:border-king/25" : null} xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer` :
                                    `${chat._id === currentChat._id ? "border border-queen/25 dark:border-king/25" : null} sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer`
                            }>
                                <div
                                    style={{ backgroundImage: `url(${chat.chat_picture ? process.env.REACT_APP_BACK_END_URL + ((chat.chat_picture).substring(7)).replace("\\", "/") : null})` }}
                                    className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden mx-auto">
                                    {
                                        !chat.chat_picture ?
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
                                        <span className="text-dark dark:text-light flex-1 text-sm truncate w-2">{chat.chat_name}</span>
                                        {
                                            chat._id === latestMessage.chat_id  ?
                                                <span className="text-dark/50 dark:text-light/50 text-xs">{format(new Date(latestMessage.createdAt), "dd/MM/yyyy") === format(new Date(), "dd/MM/yyyy") ? format(new Date(latestMessage.createdAt), "kk:mm") : format(new Date(latestMessage.createdAt), "dd/MM/yyyy")}</span> :
                                                chat.latest_message ?
                                                    <span className="text-dark/50 dark:text-light/50 text-xs">{format(new Date(chat.latest_message.createdAt), "dd/MM/yyyy") === format(new Date(), "dd/MM/yyyy") ? format(new Date(chat.latest_message.createdAt), "kk:mm") : format(new Date(chat.latest_message.createdAt), "dd/MM/yyyy")}</span> :
                                                    <span className="text-dark/50 dark:text-light/50 text-xs">{format(new Date(chat.createdAt), "dd/MM/yyyy") === format(new Date(), "dd/MM/yyyy") ? format(new Date(chat.createdAt), "kk:mm") : format(new Date(chat.createdAt), "dd/MM/yyyy")}</span>
                                        }
                                    </div>
                                    <div className="w-full flex text-left items-center">
                                        <div className="flex-1 flex truncate w-2" style={{ lineHeight: "0px" }}>
                                            <span className="text-queen dark:text-king text-xs truncate max-w-[30%]">{(chat._id === currentChat._id ? latestMessage?.sender_id?.first_name : null) || chat.latest_message?.sender_id?.first_name || "OSUM"}</span>
                                            <span className="text-queen dark:text-king text-xs mr-1">:</span>
                                            <span className="text-dark/50 dark:text-light/50 text-xs truncate max-w-[70%]">{(chat._id === currentChat._id ? latestMessage?.content : null) || chat.latest_message?.content || "No messages yet!"}</span>
                                        </div>
                                        {chat.counter > 0 && chat.counter < 10 ?
                                            <span className="text-light bg-queen dark:bg-king text-xs w-5 h-5 pl-1.5 pt-0.5 rounded-full">{chat.counter}</span> :
                                            chat.counter > 0 && chat.counter > 10 ?
                                                <span className="text-light bg-queen dark:bg-king text-xs w-5 h-5 pl-0.5 pt-0.5 rounded-full">+9</span> :
                                                null
                                        }
                                    </div>
                                </div>
                                {
                                    chat.counter > 0 ?
                                        <span className={
                                            isOpenContacts ?
                                                "text-light bg-queen dark:bg-king absolute top-1 -right-0 xs:hidden text-xs w-5 h-5 py-0.5 rounded-full" :
                                                "text-light bg-queen dark:bg-king absolute top-1 -right-0 sm:hidden text-xs w-5 h-5 py-0.5 rounded-full"
                                        }>
                                            {chat.counter > 0 && chat.counter < 10 ? chat.counter : "+9"}
                                        </span> :
                                        null
                                }
                            </div>
                        )
                    })
                }
            </>
    )
}
export default GetGroupsMessenger