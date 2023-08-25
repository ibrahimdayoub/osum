import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getComments, likeComment, deleteComment } from "../../../Redux/Features/Comments/commentsSlice";
import { getPost } from "../../../Redux/Features/Posts/postsSlice";
import { FaAngleUp, FaCrown, FaEdit, FaHeart, FaList, FaRegHeart, FaSpinner, FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns'
import UpdateComment from "./UpdateComment";
import { toastify } from "../../../Helper";

const GetComments = ({ post_id, setShowComments }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const commentsState = useSelector((state) => state.comments);
    const [showUpdate, setShowUpdate] = useState('')
    const [currentLikedCommentId, setCurrrentLikedCommentId] = useState('')
    const likeCommentSubmit = (commentId) => {
        setCurrrentLikedCommentId(commentId)
        const data = {
            id: commentId
        }
        dispatch(likeComment(data))
    }
    const deleteCommentSubmit = (commentId) => {
        const data = {
            id: commentId
        }
        dispatch(deleteComment(data))
    }
    useEffect(() => {
        const data = {
            post_id
        }
        dispatch(getComments(data))
    }, [])
    useEffect(() => {
        if ((Date.now() - commentsState.time < 100) && commentsState.status === 200 && commentsState.message && commentsState.operation === "getComments") {
            toastify("success", commentsState.status, commentsState.message)
        }
        else if ((Date.now() - commentsState.time < 100) && (commentsState.status === 400 || commentsState.status === 401 || commentsState.status === 403) && commentsState.message && commentsState.operation === "getComments") {
            toastify("error", commentsState.status, commentsState.message)
        }
        else if ((Date.now() - commentsState.time < 100) && commentsState.status === 500 && commentsState.message && commentsState.operation === "getComments") {
            toastify("warn", commentsState.status, commentsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - commentsState.time < 100) && commentsState.status === 200 && commentsState.message && commentsState.operation === "deleteComment") {
            toastify("success", commentsState.status, commentsState.message)
            dispatch(getPost({ id: commentsState.comments[0]?.post_id })) //Rest number of post comments
        }
        else if ((Date.now() - commentsState.time < 100) && (commentsState.status === 401 || commentsState.status === 403 || commentsState.status === 404) && commentsState.message && commentsState.operation === "deleteComment") {
            toastify("error", commentsState.status, commentsState.message)
        }
        else if ((Date.now() - commentsState.time < 100) && commentsState.status === 500 && commentsState.message && commentsState.operation === "deleteComment") {
            toastify("warn", commentsState.status, commentsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - commentsState.time < 100) && commentsState.status === 200 && commentsState.message && commentsState.operation === "likeComment") {
            toastify("success", commentsState.status, commentsState.message)
            const currentLikedComment = commentsState.comments.filter((comment) => {
                return comment._id === currentLikedCommentId
            })[0]
            if (currentLikedComment.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Comment By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedComment.editor_id._id],
                    redirect: `profile/${currentLikedComment.editor_id._id}`,
                    message: `There is a ${authState.auth.user.role} likes your comment, go to your profile and check it`,
                })
            }
        }
        else if ((Date.now() - commentsState.time < 100) && (commentsState.status === 401 || commentsState.status === 403 || commentsState.status === 404) && commentsState.message && commentsState.operation === "likeComment") {
            toastify("error", commentsState.status, commentsState.message)
        }
        else if ((Date.now() - commentsState.time < 100) && commentsState.status === 500 && commentsState.message && commentsState.operation === "likeComment") {
            toastify("warn", commentsState.status, commentsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [commentsState.status, commentsState.message, commentsState.errors])
    return (
        commentsState.comments.length > 0 ?
            commentsState.comments.map((comment) => {
                return (<div className="bg-dark/[0.025] dark:bg-light/[0.025] p-4 mt-2 rounded-md max-w-4xl ml-auto">
                    {/* User and date */}
                    <div className="flex justify-between items-center">
                        {/* User */}
                        <div className="flex flex-wrap items-center gap-2 cursor-pointer">
                            <div
                                style={{ backgroundImage: `url(${comment.editor_id.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((comment.editor_id.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden ">
                                {
                                    !comment.editor_id.picture_personal_profile ?
                                        <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                        null
                                }
                            </div>
                            <div>
                                <span className="text-dark dark:text-light block text-xs"><span className="mr-1 text-queen dark:text-king">{comment.editor_id.role}:</span>{`${comment.editor_id.first_name} ${comment.editor_id.last_name}`}</span>
                                <span className="text-dark/50 dark:text-light/50 block text-xs">{(formatDistanceToNow(new Date(comment.createdAt), { includeSeconds: true, addSuffix: true })).charAt(0).toUpperCase() + (formatDistanceToNow(new Date(comment.createdAt), { includeSeconds: true, addSuffix: true })).substring(1)}</span>
                            </div>
                        </div>
                        <span onClick={() => { setShowComments('') }} className="cursor-pointer">
                            <FaAngleUp className="text-queen dark:text-king text-lg" />
                        </span>
                    </div>
                    {/* Comment and Image */}
                    <div className="sm:flex flex-wrap items-start justify-between gap-4 my-1">
                        <p className="text-dark/50 dark:text-light/50 flex-1 text-xs text-justify">{comment.content}</p>
                        {
                            comment.comment_picture ?
                                <img src={process.env.REACT_APP_BACK_END_URL + ((comment.comment_picture).substring(7)).replace("\\", "/")} className="mx-auto rounded-md w-full sm:max-w-sm opacity-80 mt-2" alt={"Comment Pic"} /> :
                                null
                        }
                    </div>
                    {/* Update, Likes and Comments */}
                    <div className="text-queen dark:text-king flex justify-between items-center text-xs">
                        <div>
                            <button onClick={() => { likeCommentSubmit(comment._id) }}>
                                {comment.likes.length}
                                {
                                    comment.likes.includes(authState.auth.user._id) ?
                                        <FaHeart className="inline text-sm ml-1" /> :
                                        <FaRegHeart className="inline text-sm ml-1" />
                                }
                            </button>
                        </div>
                        {
                            comment.editor_id._id === authState.auth.user._id ?
                                <div>
                                    <button onClick={() => { deleteCommentSubmit(comment._id) }} className="mr-2">
                                        {
                                            (commentsState.isLoading && commentsState.operation === "deleteComment") ? <FaSpinner className="inline text-sm ml-1" /> :
                                                <>
                                                    <FaTrash className="inline text-sm text-start" />
                                                </>
                                        }
                                    </button>
                                    <button onClick={() => { setShowUpdate(showUpdate === comment._id ? '' : comment._id) }}>
                                        <FaEdit className="inline text-sm" />
                                    </button>
                                </div> :
                                null
                        }
                    </div>
                    {
                        showUpdate === comment._id ?
                            <UpdateComment comment={comment} setShowUpdate={setShowUpdate} /> :
                            null
                    }
                </div>)
            }) :
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2 max-w-4xl ml-auto">
                <FaList className="inline mb-1 mr-2" />
                No comments found
            </div>
    )
}
export default GetComments