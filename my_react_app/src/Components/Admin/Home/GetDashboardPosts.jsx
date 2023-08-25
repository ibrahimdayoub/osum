import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardPosts, deletePost } from "../../../Redux/Features/Posts/postsSlice";
import { FaCrown, FaSpinner, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const GetDashboardPosts = ({ setCounter, keyword }) => {
    const dispatch = useDispatch();
    const postsState = useSelector((state) => state.posts);
    const [searchResults, setSearchResults] = useState(null)
    const deletePostSubmit = (postId) => {
        dispatch(deletePost({ id: postId }))
    }
    useEffect(() => {
        dispatch(getDashboardPosts())
    }, [])
    useEffect(() => {
        const regex = new RegExp(keyword, "i")
        setSearchResults(
            postsState.posts.filter((post) => {
                return regex.test(post.content) || post.key_words.some((keyWord) => { return regex.test(keyWord) })
            })
        )
    }, [keyword])
    useEffect(() => {
        setCounter(searchResults?.length ? searchResults.length : postsState.posts.length)
    }, [searchResults])
    return (
        (searchResults?.length > 0 ? searchResults : postsState.posts).map((post) => {
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
                            <span className="text-dark dark:text-light text-sm">{`${post.editor_id.first_name} ${post.editor_id.last_name}`}</span>
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
                    <button onClick={() => { deletePostSubmit(post._id) }} className="mr-2">
                        {
                            (postsState.isLoading && postsState.operation === "deletePost") ? <FaSpinner className="inline text-base ml-1" /> :
                                <>
                                    <FaTrash className="text-queen dark:text-king hover:opacity-80 transition-opacity duration-300 text-lg" />
                                </>
                        }
                    </button>
                </div>
            </div>)
        })
    )
}
export default GetDashboardPosts