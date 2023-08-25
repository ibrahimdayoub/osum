import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStories, deleteStory, likeStory } from "../../../Redux/Features/Stories/storiesSlice";
import Modal from 'react-modal';
import { FaCrown, FaHeart, FaRegHeart, FaTimes, FaTrash } from 'react-icons/fa';
import { format, formatDistanceToNow } from "date-fns";
import AddStory from './AddStory';
import { toastify } from "../../../Helper";

const GetStories = ({ location, target_id }) => {//my_profile, target_profile (with target_id), home
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const themeState = useSelector((state) => state.theme);
    const storiesState = useSelector((state) => state.stories);
    const [openModal, setOpenModal] = useState(false);
    const [currentModalStory, setCurrentModalStory] = useState("");
    const [currentLikedStoryId, setCurrrentLikedStoryId] = useState('')
    const modalStyle = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '550px',
            height: '650px',
            borderRadius: '8px',
            background: themeState.theme === "dark" ? "#121c2d" : "#f6f6f6",
            color: themeState.theme === "dark" ? "#f6f6f6" : "#121c2d",
            borderColor: themeState.theme === "dark" ? "#f6f6f6" : "#121c2d",
            borderWidth: '0.5px',
            padding: '0px',
            fontSize: '16px'
        }
    };
    const likeStorySubmit = (storyId) => {
        setCurrrentLikedStoryId(storyId)
        const data = {
            id: storyId
        }
        dispatch(likeStory(data))
    }
    const deleteStorySubmit = (storyId) => {
        const data = {
            id: storyId
        }
        dispatch(deleteStory(data))
    }
    useEffect(() => {
        const data = {
            location,
            target_id: target_id ? target_id : ""
        }
        dispatch(getStories(data))
    }, [target_id])
    useEffect(() => {
        if ((Date.now() - storiesState.time < 100) && storiesState.status === 200 && storiesState.message && storiesState.operation === "getStories") {
            toastify("success", storiesState.status, storiesState.message)
        }
        else if ((Date.now() - storiesState.time < 100) && (storiesState.status === 400 || storiesState.status === 401 || storiesState.status === 403 || storiesState.status === 404) && storiesState.message && storiesState.operation === "getStories") {
            toastify("error", storiesState.status, storiesState.message)
        }
        else if ((Date.now() - storiesState.time < 100) && storiesState.status === 500 && storiesState.message && storiesState.operation === "getStories") {
            toastify("warn", storiesState.status, storiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - storiesState.time < 100) && storiesState.status === 200 && storiesState.message && storiesState.operation === "deleteStory") {
            toastify("success", storiesState.status, storiesState.message)
            setOpenModal(false)
        }
        else if ((Date.now() - storiesState.time < 100) && (storiesState.status === 401 || storiesState.status === 403 || storiesState.status === 404) && storiesState.message && storiesState.operation === "deleteStory") {
            toastify("error", storiesState.status, storiesState.message)
        }
        else if ((Date.now() - storiesState.time < 100) && storiesState.status === 500 && storiesState.message && storiesState.operation === "deleteStory") {
            toastify("warn", storiesState.status, storiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - storiesState.time < 100) && storiesState.status === 200 && storiesState.message && storiesState.operation === "likeStory") {
            toastify("success", storiesState.status, storiesState.message)
            setCurrentModalStory(
                (storiesState.stories.filter((story) => {
                    return story._id === currentModalStory._id;
                }))[0]
            )
            const currentLikedStory = storiesState.stories.filter((story) => {
                return story._id === currentLikedStoryId
            })[0]
            if (currentLikedStory.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Story By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedStory.editor_id._id],
                    redirect: `profile/${currentLikedStory.editor_id._id}`,
                    message: `There is a ${authState.auth.user.role} likes your story, go to your profile and check it`,
                })
            }
        }
        else if ((Date.now() - storiesState.time < 100) && (storiesState.status === 401 || storiesState.status === 403 || storiesState.status === 404) && storiesState.message && storiesState.operation === "likeStory") {
            toastify("error", storiesState.status, storiesState.message)
        }
        else if ((Date.now() - storiesState.time < 100) && storiesState.status === 500 && storiesState.message && storiesState.operation === "likeStory") {
            toastify("warn", storiesState.status, storiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [storiesState.status, storiesState.message, storiesState.errors])
    return (
        <>
            < div className="w-full h-44 mb-1 pb-1 whitespace-nowrap overflow-x-auto overflow-y-hidden" >
                {
                    location !== "target_profile" ? <AddStory /> : null
                }
                {
                    storiesState.stories.length === 0 ?
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((placeHolder, idx) => {
                            if (idx === 0) {
                                return (
                                    <div className='bg-dark/[0.025] dark:bg-light/[0.025] w-40 h-full mr-2 inline-block rounded overflow-hidden relative'>
                                        <span className='text-dark/50 dark:text-light/50 absolute top-16 left-2'>No stories found</span>
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='bg-dark/[0.025] dark:bg-light/[0.025] w-40 h-full mr-2 inline-block rounded overflow-hidden relative'>
                                        {/* <span className='text-dark/50 dark:text-light/50 absolute top-16 left-2'>No stories found</span> */}
                                    </div>
                                )
                            }
                        }) :
                        storiesState.stories.map((story) => {
                            return (
                                <div
                                    onClick={() => { setCurrentModalStory(story); setOpenModal(true) }}
                                    style={{ backgroundImage: `url(${process.env.REACT_APP_BACK_END_URL + ((story.story_picture).substring(7)).replace("\\", "/")})` }}
                                    className={`bg-dark/[0.025] dark:bg-light/[0.025] w-40 h-full mr-2 inline-block rounded overflow-hidden relative bg-cover bg-center ${location === "home" ? "opacity-75" : null}`}>
                                    {
                                        location === "home" ?
                                            <div
                                                style={{ backgroundImage: `url(${story.editor_id.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((story.editor_id.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                                className="bg-light/50 dark:bg-dark/50  text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center w-16 h-16 rounded-full overflow-hidden absolute bottom-1 right-1 ">
                                                {
                                                    !story.editor_id.picture_personal_profile ?
                                                        <FaCrown className="text-3xl absolute top-4 left-4" /> :
                                                        null
                                                }
                                            </div> :
                                            null
                                    }
                                </div>
                            )
                        })
                }
                {
                    storiesState.stories.length > 0 && storiesState.stories.length < 10 ?
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((placeHolder, idx) => {
                            return (
                                <div className='bg-dark/[0.025] dark:bg-light/[0.025] w-40 h-full mr-2 inline-block rounded overflow-hidden relative'></div>
                            )
                        }) :
                        null
                }
            </div >
            <Modal isOpen={openModal} style={modalStyle}>
                <div
                    style={{ backgroundImage: `url(${currentModalStory.story_picture ? process.env.REACT_APP_BACK_END_URL + ((currentModalStory.story_picture).substring(7)).replace("\\", "/") : null})` }}
                    className="w-full h-full bg-cover bg-center overflow-hidden relative flex flex-col justify-between items-stretch"
                >
                    {
                        !currentModalStory.story_picture ?
                            <FaCrown className="text-9xl absolute top-60 left-52" /> :
                            <div className="flex justify-between items-center">
                                <div className="flex justify-between items-center gap-2 m-2">
                                    {
                                        location === "home" ?
                                            < div
                                                style={{ backgroundImage: `url(${currentModalStory.editor_id.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((currentModalStory.editor_id.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                                className="border border-dark/50 text-dark/50 bg-cover bg-center w-16 h-16 rounded-full overflow-hidden relative " >
                                                {
                                                    !currentModalStory.editor_id.picture_personal_profile ?
                                                        <FaCrown className="text-3xl absolute top-4 left-4" /> :
                                                        null
                                                }
                                            </div > :
                                            null
                                    }
                                    <div
                                        className={
                                            location === "home" ?
                                                "bg-light/25 px-2 py-1 rounded-md" :
                                                "bg-light/25 px-2 py-3.5 rounded-md"
                                        }
                                    >
                                        {
                                            location === "home" ?
                                                <>
                                                    <span className="mr-1 text-dark/75 font-bold">{currentModalStory.editor_id.role}:</span>
                                                    <Link to={`../profile/${currentModalStory.editor_id._id}`} state={{ backTo: "home", targetRole: currentModalStory.editor_id.role }}>
                                                        <span className="text-dark text-sm">{`${currentModalStory.editor_id.first_name} ${currentModalStory.editor_id.last_name}`}</span>
                                                    </Link>
                                                </> :
                                                null
                                        }
                                        <span className="text-dark block text-xs">
                                            {
                                                location === "home" ?
                                                    formatDistanceToNow(new Date(currentModalStory.createdAt), { includeSeconds: true, addSuffix: true }) :
                                                    format(new Date(currentModalStory.createdAt), 'kk:mm dd/MM/yyyy')
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className="m-2 flex gap-2 justify-end items-center bg-light/25 p-3 text-dark/75 w-fit ml-auto rounded-md">
                                    <button onClick={() => { likeStorySubmit(currentModalStory._id) }} className="hover:text-dark/50 transition-all duration-300">
                                        {
                                            currentModalStory.likes.includes(authState.auth.user._id) ?
                                                <FaHeart className="text-sm inline" /> :
                                                <FaRegHeart className="text-sm inline" />
                                        }
                                        {
                                            currentModalStory.editor_id._id === authState.auth.user._id ?
                                                <span className="ml-0.5 text-xs">{currentModalStory.likes.length}</span> :
                                                null
                                        }
                                    </button >
                                    {
                                        currentModalStory.editor_id._id === authState.auth.user._id ?
                                            <button onClick={() => { deleteStorySubmit(currentModalStory._id) }} className="hover:text-dark/50 transition-all duration-300">
                                                <FaTrash className="text-sm" />
                                            </button> :
                                            null
                                    }
                                    <button onClick={() => setOpenModal(false)} className="hover:text-dark/50 transition-all duration-300">
                                        <FaTimes className="text-base" />
                                    </button>
                                </div>
                            </div>
                    }
                </div>
            </Modal>
        </>
    )
}
export default GetStories