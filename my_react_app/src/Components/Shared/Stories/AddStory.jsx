import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStory } from "../../../Redux/Features/Stories/storiesSlice";
import { FaPlus, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { toastify } from '../../../Helper';

const AddStory = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const storiesState = useSelector((state) => state.stories);
    const [storyPicture, setStoryPicture] = useState("");
    const handleStoryPicture = (e) => {
        const file = e.target.files[0];
        setStoryPicture(file);
    }
    const storySubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("story_picture", storyPicture);
        dispatch(addStory(formData))
    }
    useEffect(() => {
        if ((Date.now() - storiesState.time < 100) && storiesState.status === 201 && storiesState.message && storiesState.operation === "addStory") {
            toastify("success", storiesState.status, storiesState.message)
            setStoryPicture("")
            const receiversIds = storiesState.stories[0].editor_id.rate_personal_profile.map((rateObject) => {
                if (rateObject.rate > 3) {
                    return rateObject.rater_id
                }
            })
            //Add Notification (When add Story By Client, Developer or Delegate)
            socketState.socket.emit("addNotification", {
                receiversIds: receiversIds,
                redirect: `home`,
                message: `There is an ${authState.auth.user.role} published story, go to home and check it`,
            })
        }
        else if ((Date.now() - storiesState.time < 100) && (storiesState.status === 400 || storiesState.status === 401 || storiesState.status === 403) && storiesState.message && storiesState.operation === "addStory") {
            toastify("error", storiesState.status, storiesState.message);
        }
        else if ((Date.now() - storiesState.time < 100) && storiesState.status === 500 && storiesState.message && storiesState.operation === "addStory") {
            toastify("warn", storiesState.status, storiesState.message)
            setTimeout(() => {
                // navigate(0)
            }, 5000);
        }
    }, [storiesState.status, storiesState.message, storiesState.errors])
    return (
        <div className='bg-dark/[0.025] dark:bg-light/[0.025] w-40 h-full mr-2 inline-block rounded overflow-hidden relative'>
            <label htmlFor="story_picture"
                className={
                    storiesState.errors && storiesState.errors.story_picture && storiesState.operation === "addStory" ?
                        " text-danger dark:text-danger" :
                        " text-dark/50 dark:text-light/50  "
                }
            >
                <span className='absolute top-16 left-6'>
                    {
                        storiesState.errors && storiesState.errors.story_picture && storiesState.operation === "addStory" ?
                            "storiesState.errors.story_picture" :
                            storyPicture && storyPicture.name ?
                                storyPicture.name.substring(0, 12) :
                                "Add new story"
                    }
                </span>
                {
                    !storyPicture ?
                        <div
                            className={
                                storiesState.errors && storiesState.errors.story_picture && storiesState.operation === "addStory" ?
                                    "bg-light/50 dark:bg-dark/50  text-danger dark:text-danger shadow-sm shadow-danger dark:shadow-danger bg-cover bg-center w-16 h-16 rounded-full overflow-hidden absolute bottom-1 right-1" :
                                    "bg-light/50 dark:bg-dark/50  text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center w-16 h-16 rounded-full overflow-hidden absolute bottom-1 right-1"
                            }
                        >
                            <FaPlus className="text-2xl absolute top-5 left-5" />
                        </div> :
                        null
                }
            </label>
            <input
                onChange={handleStoryPicture}
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                hidden={true}
                id="story_picture"
            />
            {
                storyPicture && storyPicture.name ?
                    <>
                        <button onClick={(e) => storySubmit(e)} className="bg-light/50 dark:bg-dark/50  text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center w-16 h-16 rounded-full overflow-hidden absolute bottom-1 left-1">

                            {
                                storiesState.isLoading && storiesState.operation === "addStory" ?
                                    <FaSpinner className="text-2xl absolute top-5 left-5 animate-spin" /> :
                                    <FaCheck className="text-2xl absolute top-5 left-5" />
                            }
                        </button>
                        <button onClick={() => setStoryPicture("")} className="bg-light/50 dark:bg-dark/50  text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center w-16 h-16 rounded-full overflow-hidden absolute bottom-1 right-1">
                            <FaTimes className="text-2xl absolute top-5 left-5" />
                        </button>
                    </> :
                    null
            }
        </div>
    )
}
export default AddStory