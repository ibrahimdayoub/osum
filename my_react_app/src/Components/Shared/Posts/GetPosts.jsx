import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPosts, likePost, deletePost } from "../../../Redux/Features/Posts/postsSlice";
import { FaComment, FaCrown, FaEdit, FaHeart, FaList, FaRegComment, FaRegHeart, FaSpinner, FaTrash } from "react-icons/fa";
import { format } from 'date-fns'
import UpdatePost from "./UpdatePost";
import GetComments from "../Comments/GetComments";
import AddComment from "../Comments/AddComment";
import { toastify } from "../../../Helper";

const GetPosts = ({ location, target_id, posts }) => { //my_profile, target_profile (with target_id), home, search (with posts)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const postsState = useSelector((state) => state.posts);
    const [showComments, setShowComments] = useState('')
    const [showUpdate, setShowUpdate] = useState('')
    const [currentLikedPostId, setCurrrentLikedPostId] = useState('')
    const likePostSubmit = (postId) => {
        setCurrrentLikedPostId(postId) //For real time notification
        const data = {
            id: postId
        }
        dispatch(likePost(data))
    }
    const deletePostSubmit = (postId) => {
        const data = {
            id: postId
        }
        dispatch(deletePost(data))
    }
    useEffect(() => {
        if (location !== "search") {
            const data = {
                location,
                target_id: target_id ? target_id : ""
            }
            dispatch(getPosts(data))
        }
    }, [target_id])
    useEffect(() => {
        if ((Date.now() - postsState.time < 100) && postsState.status === 200 && postsState.message && postsState.operation === "getPosts") {
            toastify("success", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && (postsState.status === 400 || postsState.status === 401 || postsState.status === 403 || postsState.status === 404) && postsState.message && postsState.operation === "getPosts") {
            toastify("error", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && postsState.status === 500 && postsState.message && postsState.operation === "getPosts") {
            toastify("warn", postsState.status, postsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - postsState.time < 100) && postsState.status === 200 && postsState.message && postsState.operation === "deletePost") {
            toastify("success", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && (postsState.status === 401 || postsState.status === 403 || postsState.status === 404) && postsState.message && postsState.operation === "deletePost") {
            toastify("error", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && postsState.status === 500 && postsState.message && postsState.operation === "deletePost") {
            toastify("warn", postsState.status, postsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - postsState.time < 100) && postsState.status === 200 && postsState.message && postsState.operation === "likePost") {
            toastify("success", postsState.status, postsState.message)

            const currentLikedPost = postsState.posts.filter((post) => {
                return post._id === currentLikedPostId
            })[0]
            if (currentLikedPost.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Post By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedPost.editor_id._id],
                    redirect: `profile/${currentLikedPost.editor_id._id}`,
                    message: `There is a ${authState.auth.user.role} likes your post, go to your profile and check it`,
                })
            }
        }
        else if ((Date.now() - postsState.time < 100) && (postsState.status === 401 || postsState.status === 403 || postsState.status === 404) && postsState.message && postsState.operation === "likePost") {
            toastify("error", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && postsState.status === 500 && postsState.message && postsState.operation === "likePost") {
            toastify("warn", postsState.status, postsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [postsState.status, postsState.message, postsState.errors])
    return (
        (posts || postsState.posts).length > 0 ?
            (posts || postsState.posts).map((post) => {
                return (<div className="bg-dark/[0.025] dark:bg-light/[0.025] p-4 my-2 rounded-md">
                    {/* User and date */}
                    <div className="flex justify-between items-center">
                        {/* User */}
                        <div className="flex items-center gap-2 xl:gap-3">
                            <div
                                style={{ backgroundImage: `url(${post.editor_id.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((post.editor_id.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-16 h-16 rounded-full overflow-hidden ">
                                {
                                    !post.editor_id.picture_personal_profile ?
                                        <FaCrown className="text-3xl absolute top-4 left-4" /> :
                                        null
                                }
                            </div>
                            <div>
                                <span className="mr-1 text-queen dark:text-king">{post.editor_id.role}:</span>
                                <Link to={`../profile/${post.editor_id._id}`} state={{ backTo: location === "search" ? "search" : "home", targetRole: post.editor_id.role }}>
                                    <span className="text-dark dark:text-light text-sm">{`${post.editor_id.first_name} ${post.editor_id.last_name}`}</span>
                                </Link>
                                <span className="text-dark/50 dark:text-light/50 block text-sm">{format(new Date(post.createdAt), 'kk:mm dd/MM/yyyy')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-5xl mx-auto">
                        {/* About and Key words */}
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-dark dark:text-light text-sm"><span className="mr-1 text-queen dark:text-king">About:</span>{post.field_of_work}</div>
                            <div className="text-light flex flex-wrap justify-end text-sm gap-1">
                                {
                                    post.key_words.map((key_word) => {
                                        return <span className="px-1 py-0.5 bg-queen dark:bg-king rounded-md">{key_word}</span>
                                    })
                                }
                            </div>
                        </div>
                        {/* Post and Image */}
                        <div className="mb-2">
                            <p className="text-dark/50 dark:text-light/50 text-sm text-justify">{post.content}</p>
                            {
                                post.post_picture ?
                                    <img src={process.env.REACT_APP_BACK_END_URL + ((post.post_picture).substring(7)).replace("\\", "/")} className="mx-auto rounded-md min-w-full opacity-80 my-2" alt={"Post Pic"} /> :
                                    null
                            }
                        </div>
                        {/* Update, Likes and Comments */}
                        <div className={
                            post.editor_id._id === authState.auth.user._id ?
                                "text-queen dark:text-king flex justify-between items-center text-sm" :
                                "text-queen dark:text-king flex justify-end items-center text-sm"
                        }
                        >

                            {
                                post.editor_id._id === authState.auth.user._id ?
                                    <div>
                                        <button onClick={() => { deletePostSubmit(post._id) }} className="mr-2">
                                            {
                                                (postsState.isLoading && postsState.operation === "deletePost") ? <FaSpinner className="inline text-base ml-1" /> :
                                                    <>
                                                        <FaTrash className="inline text-start text-base" />
                                                    </>
                                            }
                                        </button>
                                        <button onClick={() => { setShowUpdate(showUpdate === post._id ? '' : post._id); setShowComments('') }}>
                                            <FaEdit className="inline text-base" />
                                        </button>
                                    </div> :
                                    null
                            }
                            <div>
                                <button onClick={() => { setShowComments(showComments === post._id ? '' : post._id); setShowUpdate('') }} className="mr-2">
                                    {post.comments.length}
                                    {
                                        (post.comments.filter((comment) => {
                                            return comment.editor_id === authState.auth.user._id
                                        })).length > 0 ?
                                            <FaComment className="inline text-base ml-1" /> :
                                            <FaRegComment className="inline text-base ml-1" />
                                    }
                                </button>
                                <button onClick={() => { likePostSubmit(post._id) }}>
                                    {post.likes.length}
                                    {
                                        post.likes.includes(authState.auth.user._id) ?
                                            <FaHeart className="inline text-base ml-1" /> :
                                            <FaRegHeart className="inline text-base ml-1" />
                                    }
                                </button>
                            </div>
                        </div>
                        {
                            showUpdate === post._id ?
                                <UpdatePost post={post} setShowUpdate={setShowUpdate} /> :
                                null
                        }
                        {
                            showComments === post._id ?
                                <>
                                    <AddComment post_id={post._id} />
                                    <GetComments post_id={post._id} setShowComments={setShowComments} />
                                </>
                                :
                                null
                        }
                    </div>
                </div>)
            }) :
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2">
                <FaList className="inline mb-1 mr-2" />
                No posts found
            </div>
    )
}
export default GetPosts