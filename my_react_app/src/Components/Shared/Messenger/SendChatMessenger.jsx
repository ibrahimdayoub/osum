import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { reSortChats, resetSpecificChatCounter } from '../../../Redux/Features/Chats/chatsSlice';
import { addMessage } from '../../../Redux/Features/Messages/messagesSlice';
import { FaPaperPlane, FaPaperclip, FaSpinner } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const SendChatMessenger = ({ currentChat, setLatestMessage }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const messagesState = useSelector((state) => state.messages);
    const [content, setContent] = useState("");
    const [contentPicture, setContentPicture] = useState("");
    const handleContent = (e) => {
        e.persist()
        setContent(e.target.value)
    }
    const handleContentPicture = (e) => {
        const file = e.target.files[0];
        setContentPicture(file);
        if (!content) {
            setContent("Image without description")
        }
    }
    const addMessageSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData();
        formData.append("content", content);
        formData.append("content_picture", contentPicture);
        formData.append("chat_id", currentChat._id);
        dispatch(addMessage({ data: formData }));
    }
    useEffect(() => {
        if ((Date.now() - messagesState.time < 100) && messagesState.status === 201 && messagesState.message && messagesState.operation === "addMessage") {
            // toastify("success", messagesState.status, messagesState.message)
            setContent("")
            setContentPicture("")
            setLatestMessage(messagesState.messages[messagesState.messages.length - 1])
            dispatch(reSortChats({ chat_id: currentChat._id }))
            dispatch(resetSpecificChatCounter({ chat: { chat_id: currentChat._id } }))
            //Add Message (When Add Message By Client, Developer, Delegate or Admin)
            const unreaders_ids = (currentChat.users_ids.filter((user) => { return user._id !== authState.auth.user._id })).map((user) => { return user._id })
            socketState.socket.emit("addMessage", { message: { ...messagesState.messages[messagesState.messages.length - 1], unreaders_ids } })
        }
        else if ((Date.now() - messagesState.time < 100) &&  (messagesState.status === 400 || messagesState.status === 401 || messagesState.status === 403 || messagesState.status === 404) && messagesState.message && messagesState.operation === "addMessage") {
            toastify("error", messagesState.status, messagesState.message)
            setContent("")
            setContentPicture("")
        }
        else if ((Date.now() - messagesState.time < 100) &&  messagesState.status === 500 && messagesState.message && messagesState.operation === "addMessage") {
            toastify("warn", messagesState.status, messagesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [messagesState.status, messagesState.message, messagesState.errors])
    return (
        <div className="text-dark/50 dark:text-light/50">
            <form encType="multipart/form-data" onSubmit={(e) => { addMessageSubmit(e) }}>
                <div className='flex gap-2 border-t border-t-queen dark:border-t-king mt-2 px-4 py-1'>
                    <div className='flex-1'>
                        <label htmlFor="content" className="sr-only">
                            Content
                        </label>
                        <input
                            disabled={!currentChat}
                            value={content}
                            onChange={handleContent}
                            name="content"
                            className={
                                messagesState.errors && messagesState.errors.content && messagesState.operation === "addMessage" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent py-2 relative block w-full appearance-none focus:z-10 focus:outline-none text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent py-2 relative block w-full appearance-none focus:z-10 focus:outline-none text-sm"
                            }
                            placeholder={messagesState.errors && messagesState.errors.content && messagesState.operation === "addMessage" ? messagesState.errors.content : "Type Message..."}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="content_picture"
                            className={
                                !currentChat ?
                                    "hover:opacity-75" :
                                    "cursor-pointer hover:opacity-75"
                            }
                        >
                            <FaPaperclip
                                className={
                                    contentPicture ?
                                        "text-queen dark:text-king text-xl mt-2" :
                                        "text-xl mt-2"
                                }
                            />
                        </label>
                        <input
                            disabled={!currentChat}
                            onChange={handleContentPicture}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="content_picture"
                        />
                    </div>
                    <button type="submit" disabled={!currentChat} className="hover:opacity-75">
                        {
                            (messagesState.isLoading && messagesState.operation === "addMessage") ? <FaSpinner className="text-sm animate-spin inline mr-1" /> :
                                <>
                                    <FaPaperPlane className="inline text-lg mb-1" />
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default SendChatMessenger