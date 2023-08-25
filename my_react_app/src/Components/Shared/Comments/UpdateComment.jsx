import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateComment } from "../../../Redux/Features/Comments/commentsSlice";
import { FaEdit, FaFileImage, FaScroll, FaSpinner } from 'react-icons/fa'
import { toastify } from "../../../Helper";

const UpdateComment = ({ comment, setShowUpdate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const commentsState = useSelector((state) => state.comments);
    const [showUpdateAlt, setShowUpdateAlt] = useState(false)
    const [commentInput, setCommentInput] = useState({
        content: comment.content,
    });
    const [commentPicture, setCommentPicture] = useState("");
    const handleCommentInput = (e) => {
        e.persist();
        setCommentInput({ ...commentInput, [e.target.name]: e.target.value });
    };
    const handleCommentPicture = (e) => {
        const file = e.target.files[0];
        setCommentPicture(file);
    }
    const commentUpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("content", commentInput.content);
        formData.append("comment_picture", commentPicture);
        dispatch(updateComment({ id: comment._id, data: formData }))
        setShowUpdateAlt(true)
    }
    useEffect(() => {
        if ((Date.now() - commentsState.time < 100) &&  commentsState.status === 200 && commentsState.message && commentsState.operation === "updateComment") {
            toastify("success", commentsState.status, commentsState.message)
            if (showUpdateAlt) {
                setShowUpdate('')
            }
        }
        else if ((Date.now() - commentsState.time < 100) &&  (commentsState.status === 400 || commentsState.status === 401 || commentsState.status === 403) && commentsState.message && commentsState.operation === "updateComment") {
            toastify("error", commentsState.status, commentsState.message)
        }
        else if ((Date.now() - commentsState.time < 100) &&  commentsState.status === 404 && commentsState.message && commentsState.operation === "updateComment") {
            toastify("error", commentsState.status, commentsState.message)
            setCommentInput({
                key_words: comment.key_words,
                field_of_work: comment.field_of_work,
                content: comment.content,
            })
            setCommentPicture("")
        }
        else if ((Date.now() - commentsState.time < 100) &&  commentsState.status === 500 && commentsState.message && commentsState.operation === "updateComment") {
            toastify("warn", commentsState.status, commentsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [commentsState.status, commentsState.message, commentsState.errors])
    return (
        <div className='bg-dark/[0.025] dark:bg-light/[0.025] p-2 my-2 rounded-md'>
            <h2 className="text-dark dark:text-light text-base">
                <FaScroll className="inline text-lg mr-2" />
                Update your comment and contact with all:
            </h2>
            <form enctype="multipart/form-data" onSubmit={(e) => { commentUpdateSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1">
                        <label htmlFor="content" className="sr-only">
                            Content
                        </label>
                        <textarea
                            value={commentInput.content}
                            onChange={handleCommentInput}
                            rows={1}
                            name="content"
                            type="text"
                            className={
                                commentsState.errors && commentsState.errors.content && commentsState.operation === "updateComment" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={commentsState.errors && commentsState.errors.content && commentsState.operation === "updateComment" ? commentsState.errors.content : "What is new ?"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="comment_picture"
                            className={
                                commentsState.errors && commentsState.errors.comment_picture && commentsState.operation === "updateComment" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                        >
                            {
                                commentsState.errors && commentsState.errors.comment_picture && commentsState.operation === "updateComment" ?
                                    commentsState.errors.comment_picture :
                                    commentPicture && commentPicture.name ?
                                        <span className="text-dark dark:text-light">{commentPicture.name}</span> :
                                        "Have a new image ?"
                            }
                            <div
                                className={
                                    commentsState.errors && commentsState.errors.comment_picture && commentsState.operation === "updateComment" ?
                                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute -right-4 top-0 cursor-pointer w-10 p-1 z-10" :
                                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute -right-4 top-0 cursor-pointer w-10 p-1 z-10"
                                }
                            >
                                <FaFileImage className="text-base" />
                            </div>
                        </label>
                        <input
                            onChange={handleCommentPicture}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="comment_picture"
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (commentsState.isLoading && commentsState.operation === "updateComment") ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                <>
                                    <FaEdit className="inline text-xs mr-1 mb-0.5" />
                                    Update
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default UpdateComment