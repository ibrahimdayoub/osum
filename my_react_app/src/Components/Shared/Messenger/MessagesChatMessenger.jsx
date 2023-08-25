import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getChatMessages } from '../../../Redux/Features/Messages/messagesSlice';
import { format } from 'date-fns';
import { toastify } from '../../../Helper';
import { FaDownload } from 'react-icons/fa';

const MessagesChatMessenger = ({ isOpenChat, currentChat, toBottomChatRef }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const messagesState = useSelector((state) => state.messages);
    const [showMessageDate, setShowMessageDate] = useState("");
    const handleImageClick = (src, alt) => {
        fetch(src)
            .then(response => response.blob())
            .then(blob => {
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = alt; // Set the filename for the downloaded file
                link.click();

                // Clean up the temporary element
                URL.revokeObjectURL(link.href);
                link.remove();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };
    useEffect(() => {
        dispatch(getChatMessages({ "chat_id": currentChat._id }))
    }, [currentChat])
    useEffect(() => {
        if ((Date.now() - messagesState.time < 100) && messagesState.status === 200 && messagesState.message && messagesState.operation === "getChatMessages") {
            toastify("success", messagesState.status, messagesState.message)
        }
        else if ((Date.now() - messagesState.time < 100) && (messagesState.status === 401 || messagesState.status === 403 || messagesState.status === 404) && messagesState.message && messagesState.operation === "getChatMessages") {
            toastify("error", messagesState.status, messagesState.message)
        }
        else if ((Date.now() - messagesState.time < 100) && messagesState.status === 500 && messagesState.message && messagesState.operation === "getChatMessages") {
            toastify("warn", messagesState.status, messagesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [messagesState.status, messagesState.message, messagesState.errors])
    return (
        <div id="chat-box" className="h-[550px] max-h-[550px] overflow-y-scroll px-2 pt-2.5 flex flex-col">
            {
                !currentChat ?
                    <div className="text-dark/50 dark:text-light/50 text-center px-4 py-10 h-full">
                        Select chat to contact...
                    </div> :
                    <>
                        {
                            messagesState.messages.length !== 0 ?
                                messagesState.messages.map((message, idx) => {
                                    if (message.sender_id._id === authState.auth.user._id) {
                                        return (
                                            <>
                                                <div
                                                    className={
                                                        isOpenChat ?
                                                            "bg-queen rounded-lg mb-1 px-2 py-1 max-w-[256px] sm:max-w-[320px] md:m-w-[384px] lg:max-w-[512px] xl:max-w-[676px] self-end break-words" :
                                                            "bg-queen rounded-lg mb-1 px-2 py-1 max-w-[192px] sm:max-w-[244px] md:max-w-[288px] lg:max-w-[384px] xl:max-w-[512px] self-end break-words"

                                                    }>
                                                    <div>
                                                        {/* Image */}
                                                        {
                                                            message.content_picture ?
                                                                <img className="mx-auto rounded-md my-2" src={process.env.REACT_APP_BACK_END_URL + ((message.content_picture).substring(7)).replace("\\", "/")} alt={"Message Pic"} /> :
                                                                null
                                                        }
                                                        {/*Message*/}
                                                        <p
                                                            onClick={() => { setShowMessageDate(showMessageDate === message._id ? null : message._id) }}
                                                            className="text-light text-xs flex justify-between items-start gap-2 cursor-pointer">
                                                            {
                                                                message.content
                                                            }
                                                            {
                                                                message.content_picture ?
                                                                    <span onClick={() => handleImageClick(process.env.REACT_APP_BACK_END_URL + ((message.content_picture).substring(7)).replace("\\", "/"), message.content)}>
                                                                        <FaDownload className='hover:opacity-75 transition-opacity duration-300' />
                                                                    </span> :
                                                                    null
                                                            }
                                                        </p>
                                                        {
                                                            showMessageDate === message._id ?
                                                                <>
                                                                    {/*Date*/}
                                                                    <p className="text-light/50 text-xs text-end mt-0">
                                                                        {
                                                                            format(new Date(message.createdAt), "kk:mm dd/MM/yyyy")
                                                                        }
                                                                    </p>
                                                                </> :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    idx === messagesState.messages.length - 1 - messagesState.chatCounter && idx !== messagesState.messages.length - 1 ?
                                                        <>
                                                            <div ref={toBottomChatRef} />
                                                            <span className="bg-dark/[0.025] dark:bg-light/[0.025] text-dark dark:text-light text-xs px-2 py-1 mx-auto my-2 rounded-lg">{messagesState.chatCounter} New {messagesState.chatCounter > 1 ? "Messages" : "Message"}</span>
                                                        </> :
                                                        null
                                                }
                                            </>
                                        )
                                    }
                                    else {
                                        return (
                                            <>
                                                <div
                                                    className={
                                                        isOpenChat ?
                                                            "bg-king rounded-lg mb-1 px-2 py-1 max-w-[256px] sm:max-w-[320px] md:m-w-[384px] lg:max-w-[512px] xl:max-w-[676px] self-start break-words" :
                                                            "bg-king rounded-lg mb-1 px-2 py-1 max-w-[192px] sm:max-w-[244px] md:max-w-[288px] lg:max-w-[384px] xl:max-w-[512px] self-start break-words"

                                                    }>
                                                    <div>
                                                        {/* Image */}
                                                        {
                                                            message.content_picture ?
                                                                <img src={process.env.REACT_APP_BACK_END_URL + ((message.content_picture).substring(7)).replace("\\", "/")} className="mx-auto rounded-md my-2" alt={"Message Pic"} /> :
                                                                null
                                                        }
                                                        {/*Message*/}
                                                        <p
                                                            onClick={() => { setShowMessageDate(showMessageDate === message._id ? null : message._id) }}
                                                            className="text-light text-xs flex justify-between items-start gap-2 cursor-pointer">
                                                            {
                                                                currentChat.is_group ?
                                                                    <>
                                                                        <span className="font-bold mr-1">{`${message.sender_id.first_name} ${message.sender_id.last_name}:`}</span>{message.content}
                                                                    </> :
                                                                    message.content
                                                            }
                                                            {
                                                                message.content_picture ?
                                                                    <span onClick={() => handleImageClick(process.env.REACT_APP_BACK_END_URL + ((message.content_picture).substring(7)).replace("\\", "/"), message.content)}>
                                                                        <FaDownload className='hover:opacity-75 transition-opacity duration-300' />
                                                                    </span> :
                                                                    null
                                                            }
                                                        </p>
                                                        {
                                                            showMessageDate === message._id ?
                                                                <>
                                                                    {/*Date*/}
                                                                    <p className="text-light/50 text-xs text-end mt-0">
                                                                        {
                                                                            format(new Date(message.createdAt), "kk:mm dd/MM/yyyy")
                                                                        }
                                                                    </p>
                                                                </> :
                                                                null
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    idx === messagesState.messages.length - 1 - messagesState.chatCounter && idx !== messagesState.messages.length - 1 ?
                                                        <>
                                                            <div ref={toBottomChatRef} />
                                                            <span className="bg-dark/[0.025] dark:bg-light/[0.025] text-dark dark:text-light text-xs px-2 py-1 mx-auto my-2 rounded-lg">{messagesState.chatCounter} New {messagesState.chatCounter > 1 ? "Messages" : "Message"}</span>
                                                        </> :
                                                        null
                                                }
                                            </>
                                        )
                                    }
                                }) :
                                <div className="text-dark/50 dark:text-light/50 text-center px-4 py-10 h-full">
                                    Type your first message...
                                </div>
                        }
                    </>
            }
            {messagesState.chatCounter === 0 ? <div ref={toBottomChatRef} /> : null}
        </div>
    )
}
export default MessagesChatMessenger