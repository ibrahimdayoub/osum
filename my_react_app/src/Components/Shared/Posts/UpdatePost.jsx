import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updatePost } from "../../../Redux/Features/Posts/postsSlice";
import { FaEdit, FaFileImage, FaScroll, FaSpinner } from 'react-icons/fa'
import { toastify } from "../../../Helper";

const UpdatePost = ({ post, setShowUpdate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const postsState = useSelector((state) => state.posts);
    const [showUpdateAlt, setShowUpdateAlt] = useState(false)
    const [postInput, setPostInput] = useState({
        key_words: post.key_words.join(","),
        field_of_work: post.field_of_work,
        content: post.content,
    });
    const [postPicture, setPostPicture] = useState("");
    const handlePostInput = (e) => {
        e.persist();
        setPostInput({ ...postInput, [e.target.name]: e.target.value });
    };
    const handlePostPicture = (e) => {
        const file = e.target.files[0];
        setPostPicture(file);
    }
    const postUpdateSubmit = (e) => {
        e.preventDefault();
        let keyWords = postInput.key_words.split(",")
        keyWords = keyWords.filter((keyWord) => {
            return keyWord
        })
        const formData = new FormData();
        formData.append("key_words", keyWords);
        formData.append("field_of_work", postInput.field_of_work);
        formData.append("content", postInput.content);
        formData.append("post_picture", postPicture);
        dispatch(updatePost({ id: post._id, data: formData }))
        setShowUpdateAlt(true)
    }
    useEffect(() => {
        if ((Date.now() - postsState.time < 100) &&  postsState.status === 200 && postsState.message && postsState.operation === "updatePost") {
            toastify("success", postsState.status, postsState.message)
            if (showUpdateAlt) {
                setShowUpdate('')
            }
        }
        else if ((Date.now() - postsState.time < 100) &&  (postsState.status === 400 || postsState.status === 401 || postsState.status === 403) && postsState.message && postsState.operation === "updatePost") {
            toastify("error", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) &&  postsState.status === 404 && postsState.message && postsState.operation === "updatePost") {
            toastify("erroe", postsState.status, postsState.message)
            setPostInput({
                key_words: post.key_words,
                field_of_work: post.field_of_work,
                content: post.content,
            })
            setPostPicture("")
        }
        else if ((Date.now() - postsState.time < 100) &&  postsState.status === 500 && postsState.message && postsState.operation === "updatePost") {
            toastify("warn", postsState.status, postsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [postsState.status, postsState.message, postsState.errors])
    return (
        <div className='bg-dark/[0.025] dark:bg-light/[0.025] p-2 mt-2 rounded-md'>
            <h2 className="text-dark dark:text-light text-base">
                <FaScroll className="inline text-lg mr-2" />
                Update your post and contact with all:
            </h2>
            <form enctype="multipart/form-data" onSubmit={(e) => { postUpdateSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1">
                        <label htmlFor="key-words" className="sr-only">
                            Key words
                        </label>
                        <input
                            value={postInput.key_words}
                            onChange={handlePostInput}
                            name="key_words"
                            className={
                                postsState.errors && postsState.errors.key_words && postsState.operation === "updatePost" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={postsState.errors && postsState.errors.key_words && postsState.operation === "updatePost" ? postsState.errors.key_words : "Key words and separate it by comma !"}
                        />
                    </div>
                    <div className="mb-1">
                        <select
                            value={postInput.field_of_work}
                            onChange={handlePostInput}
                            name="field_of_work"
                            className={
                                postsState.errors && postsState.errors.field_of_work && postsState.operation === "updatePost" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger/50 dark:text-danger/50 bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                        >
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Publish about ?</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Programming</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Designing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Content Writing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Translation</option>
                        </select>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="content" className="sr-only">
                            Content
                        </label>
                        <textarea
                            value={postInput.content}
                            onChange={handlePostInput}
                            rows={1}
                            name="content"
                            type="text"
                            className={
                                postsState.errors && postsState.errors.content && postsState.operation === "updatePost" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={postsState.errors && postsState.errors.content && postsState.operation === "updatePost" ? postsState.errors.content : "What is new ?"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="post_picture"
                            className={
                                postsState.errors && postsState.errors.post_picture && postsState.operation === "updatePost" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                        >
                            {
                                postsState.errors && postsState.errors.post_picture && postsState.operation === "updatePost" ?
                                    postsState.errors.post_picture :
                                    postPicture && postPicture.name ?
                                        <span className="text-dark dark:text-light">{postPicture.name}</span> :
                                        "Have a new image ?"
                            }
                            <div
                                className={
                                    postsState.errors && postsState.errors.post_picture && postsState.operation === "updatePost" ?
                                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute -right-4 top-0 cursor-pointer w-10 p-1 z-10" :
                                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute -right-4 top-0 cursor-pointer w-10 p-1 z-10"
                                }
                            >
                                <FaFileImage className="text-base" />
                            </div>
                        </label>
                        <input
                            onChange={handlePostPicture}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="post_picture"
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (postsState.isLoading && postsState.operation === "updatePost") ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
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
export default UpdatePost