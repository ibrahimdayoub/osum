import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTeam, leaveTeam } from '../../../Redux/Features/Teams/teamsSlice';
import { FaCrown, FaDoorOpen, FaEdit, FaTrash } from "react-icons/fa"
import { toastify } from '../../../Helper';

const HeadTeam = ({ currentTeam, setCurrentTeam, setUpdatedTeam, setSearchParams }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const teamsState = useSelector((state) => state.teams);
    const handleOpenUpdate = (teamId) => {
        setUpdatedTeam(teamId)
        setSearchParams("?tab=teams")
    }
    const deleteTeamSubmit = (teamId) => {
        const data = {
            "id": teamId,
        }
        dispatch(deleteTeam(data))
    }
    const leaveTeamSubmit = (teamId) => {
        const data = {
            user_id: authState.auth.user._id
        }
        dispatch(leaveTeam({ id: teamId, data }))
    }
    useEffect(() => {
        if ((Date.now() - teamsState.time < 100) && teamsState.status === 200 && teamsState.message && teamsState.operation === "deleteTeam") {
            toastify("success", teamsState.status, teamsState.message)
            setCurrentTeam("")
        }
        else if ((Date.now() - teamsState.time < 100) && (teamsState.status === 400 || teamsState.status === 401 || teamsState.status === 403) && teamsState.message && teamsState.operation === "deleteTeam") {
            toastify("error", teamsState.status, teamsState.message)
        }
        else if ((Date.now() - teamsState.time < 100) && teamsState.status === 500 && teamsState.message && teamsState.operation === "deleteTeam") {
            toastify("warn", teamsState.status, teamsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - teamsState.time < 100) && teamsState.status === 200 && teamsState.message && teamsState.operation === "leaveTeam") {
            toastify("success", teamsState.status, teamsState.message)
            setCurrentTeam("")
        }
        else if ((Date.now() - teamsState.time < 100) && (teamsState.status === 400 || teamsState.status === 401 || teamsState.status === 403) && teamsState.message && teamsState.operation === "leaveTeam") {
            toastify("error", teamsState.status, teamsState.message)
        }
        else if ((Date.now() - teamsState.time < 100) && teamsState.status === 500 && teamsState.message && teamsState.operation === "leaveTeam") {
            toastify("warn", teamsState.status, teamsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [teamsState.status, teamsState.message, teamsState.errors])
    return (
        <div className="border-queen/50 dark:border-king/50 border-b flex flex-wrap justify-between items-center px-4 py-2">
            {/*Image & Name*/}
            <div className="flex flex-wrap justify-between items-center gap-2">
                {/*Image*/}
                {
                    currentTeam ?
                        <div
                            style={{ backgroundImage: `url(${currentTeam.team_picture ? process.env.REACT_APP_BACK_END_URL + ((currentTeam.team_picture).substring(7)).replace("\\", "/") : null})` }}
                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                            {
                                !currentTeam.team_picture ?
                                    <FaCrown className="text-2xl absolute top-4 left-4" /> :
                                    null
                            }
                        </div> :
                        <div
                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                            <FaCrown className="text-2xl absolute top-4 left-4" />
                        </div>
                }
                {/*Name*/}
                <div className="flex flex-col">
                    {
                        currentTeam ?
                            <span className="text-sm sm:text-lg text-dark dark:text-light">{currentTeam.team_name}</span> :
                            <span className="text-sm sm:text-lg text-dark dark:text-light">Team Name</span>
                    }
                    <span className="text-xs text-queen dark:text-king">
                        {
                            currentTeam ?
                                currentTeam.team_description :
                                "Team Description"
                        }
                    </span>
                </div>
            </div>
            {/*Options*/}
            <div className="flex flex-wrap gap-1 mr-2">
                {
                    currentTeam && currentTeam.leader_id._id === authState.auth.user._id ?
                        <>
                            <button title="Edit" onClick={() => { handleOpenUpdate(currentTeam._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                <FaEdit className="text-base" />
                            </button>
                            <button title="Delete" onClick={() => { deleteTeamSubmit(currentTeam._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                <FaTrash className="text-base" />
                            </button>
                        </> :
                        currentTeam && currentTeam.leader_id._id !== authState.auth.user._id ?
                            <button title="Leave" onClick={() => { leaveTeamSubmit(currentTeam._id) }} className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300">
                                <FaDoorOpen className="text-base" />
                            </button> :
                            null
                }
            </div>
        </div>
    )
}
export default HeadTeam