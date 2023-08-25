import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchUsers } from '../../../Redux/Features/Users/usersSlice';
import { addTeam } from '../../../Redux/Features/Teams/teamsSlice';
import { FaCrown, FaList, FaPlus, FaSpinner, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { toastify } from '../../../Helper';

const AddTeam = ({ isOpenTeams, setSearchParams, setCurrentTeam }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const usersState = useSelector((state) => state.users);
    const teamsState = useSelector((state) => state.teams);
    const [searchMemberId, setSearchMemberId] = useState("");
    const [teamInput, setTeamInput] = useState({
        team_name: "",
        team_description: "",
        field_of_work: ""
    });
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamPicture, setTeamPicture] = useState("");
    const toastOptions = {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };
    const handleTeamInput = (e) => {
        e.persist();
        setTeamInput({ ...teamInput, [e.target.name]: e.target.value });
    };
    const searchMemberIdSubmit = (e) => {
        e.persist();
        setSearchMemberId(e.target.value);
        const data = {
            key: e.target.value
        }
        dispatch(searchUsers(data))
    }
    const handleTeamMembers = (user) => {
        const userIsExists = teamMembers.some((teamMember) => {
            return teamMember._id === user._id
        })
        if (!userIsExists) {
            setTeamMembers([...teamMembers, user])
        }
        else {
            setTeamMembers(teamMembers.filter((teamMember) => {
                return teamMember._id !== user._id
            }))
        }
    }
    const handleTeamPicture = (e) => {
        const file = e.target.files[0];
        setTeamPicture(file);
    }
    const addTeamSubmit = (e) => {
        e.preventDefault();
        const membersIds = teamMembers.map((user) => {
            return user._id
        })
        const formData = new FormData();
        formData.append("team_name", teamInput.team_name);
        formData.append("team_description", teamInput.team_description);
        formData.append("field_of_work", teamInput.field_of_work);
        formData.append("members_ids", membersIds);
        formData.append("team_picture", teamPicture);
        formData.append("company_id", authState.auth.user.company_id);
        if (authState.auth.user.role === "Delegate" && !authState.auth.user.company_id) {
            toast.error(
                "Code " + 404 + " | You don't have company yet",
                toastOptions
            );
        }
        else {
            dispatch(addTeam(formData))
        }
    }
    useEffect(() => {
        if ((Date.now() - teamsState.time < 100) && teamsState.status === 201 && teamsState.message && teamsState.operation === "addTeam") {
            toastify("success", teamsState.status, teamsState.message)
            setSearchMemberId("")
            setTeamInput({
                team_name: "",
                team_description: "",
                field_of_work: ""
            })
            setTeamMembers([])
            setTeamPicture("")
            setSearchParams("?tab=team")
            setCurrentTeam(teamsState.teams[0])
            //Add Notification (When Add Team By Developer or Delegate)
            socketState.socket.emit("addNotification", {
                receiversIds: teamsState.teams[0].members_ids.map((member) => {return member._id}),
                redirect: "teams",
                message: "There is a new team created, and you added as member in it",
            })
        }
        else if ((Date.now() - teamsState.time < 100) && (teamsState.status === 400 || teamsState.status === 401 || teamsState.status === 403 || teamsState.status === 404) && teamsState.message && teamsState.operation === "addTeam") {
            toastify("error", teamsState.status, teamsState.message)
        }
        else if ((Date.now() - teamsState.time < 100) && teamsState.status === 500 && teamsState.message && teamsState.operation === "addTeam") {
            toastify("warn", teamsState.status, teamsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [teamsState.status, teamsState.message, teamsState.errors])
    return (
        <div className="text-dark/50 dark:text-light/50 text-left text-xs sm:text-lg py-1 px-1 ml-1">
            <form encType="multipart/form-data" onSubmit={(e) => { addTeamSubmit(e) }}>
                <div>
                    <div className="mb-1">
                        <label htmlFor="team_name" className="sr-only">
                            Team Name
                        </label>
                        <input
                            value={teamInput.team_name}
                            onChange={handleTeamInput}
                            name="team_name"
                            className={
                                teamsState.errors && teamsState.errors.team_name && teamsState.operation === "addTeam" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={teamsState.errors && teamsState.errors.team_name && teamsState.operation === "addTeam" ? teamsState.errors.team_name : "Team Name"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="team_description" className="sr-only">
                            Team Description
                        </label>
                        <input
                            value={teamInput.team_description}
                            onChange={handleTeamInput}
                            name="team_description"
                            className={
                                teamsState.errors && teamsState.errors.team_description && teamsState.operation === "addTeam" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={teamsState.errors && teamsState.errors.team_description && teamsState.operation === "addTeam" ? teamsState.errors.team_description : "Team Description"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="members" className="sr-only">
                            Team Members
                        </label>
                        <input
                            value={searchMemberId}
                            onChange={searchMemberIdSubmit}
                            className={
                                teamsState.errors && teamsState.errors.members_ids && teamsState.operation === "addTeam" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={teamsState.errors && teamsState.errors.members_ids && teamsState.operation === "addTeam" ? teamsState.errors.members_ids : "Team Members"}
                        />
                    </div>
                    <div className={
                        isOpenTeams ?
                            "mb-1 hidden xs:flex flex-wrap" :
                            "mb-1 hidden sm:flex flex-wrap"
                    }>
                        {
                            teamMembers.map((member) => {
                                return (
                                    <span
                                        onClick={() => { handleTeamMembers(member) }}
                                        className="bg-queen dark:bg-king text-light text-xs py-1 px-2 rounded m-1 cursor-pointer hover:opacity-75 duration-500 transition-opacity"
                                    >
                                        <FaTimes className="inline mr-1" />{`${member.first_name} ${member.last_name}`}
                                    </span>
                                )
                            })
                        }
                    </div>
                    {usersState.users.length !== 0 && searchMemberId.length !== 0 ?
                        <div>
                            {
                                usersState.users.map((user) => {
                                    if (user.role === "Developer" && user._id !== authState.auth.user._id) {
                                        return (
                                            <div
                                                onClick={() => { handleTeamMembers(user) }}
                                                className={
                                                    isOpenTeams ?
                                                        "xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer" :
                                                        "sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 -ml-1 xs:gap-1 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer"
                                                }>
                                                <div
                                                    style={{ backgroundImage: `url(${user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((user.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                                                    className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden ">
                                                    {
                                                        !user.picture_personal_profile ?
                                                            <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                                            null
                                                    }
                                                </div>
                                                <div className={
                                                    isOpenTeams ?
                                                        "w-3/4  hidden xs:flex-1 xs:flex flex-col" :
                                                        "w-3/4  hidden sm:flex-1 sm:flex flex-col"
                                                }>
                                                    <div className="w-full flex items-center text-left">
                                                        <span className={
                                                            !teamMembers.some(teamMember => teamMember._id === user._id) ?
                                                                "text-dark dark:text-light flex-1 text-sm truncate w-2" :
                                                                "text-queen dark:text-king flex-1 text-sm truncate w-2"
                                                        }>{`${user.first_name} ${user.last_name}`}</span>
                                                    </div>
                                                    <div className="w-full flex items-center text-left">
                                                        <span className={
                                                            !teamMembers.some(teamMember => teamMember._id === user._id) ?
                                                                "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                                "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                        }>{user.role}</span>
                                                    </div>
                                                    <div className="w-full flex items-center text-left">
                                                        <span className={
                                                            !teamMembers.some(teamMember => teamMember._id === user._id) ?
                                                                "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2" :
                                                                "text-queen/50 dark:text-king/50 flex-1 text-xs truncate w-2"
                                                        }>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else {
                                        return null
                                    }
                                })
                            }
                        </div> :
                        usersState.users.length === 0 && searchMemberId.length !== 0 ?
                            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2 max-w-4xl ml-auto">
                                <FaList className="inline mb-1 mr-2" />
                                No users found
                            </div> :
                            null
                    }
                    <div className="mb-1">
                        <select
                            value={teamInput.field_of_work}
                            onChange={handleTeamInput}
                            name="field_of_work"
                            className={
                                teamsState.errors && teamsState.errors.field_of_work && teamsState.operation === "addTeam" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger/50 dark:text-danger/50 bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                        >
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Select field of work</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Programming</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Designing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Content Writing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Translation</option>
                        </select>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="team_picture"
                            className={
                                teamsState.errors && teamsState.errors.team_picture && teamsState.operation === "addTeam" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                        >
                            {
                                teamsState.errors && teamsState.errors.team_picture && teamsState.operation === "addTeam" ?
                                    "teamsState.errors.team_picture" :
                                    teamPicture && teamPicture.name ?
                                        <span className="text-dark/50 dark:text-light/50">{teamPicture.name}</span> :
                                        <span className="text-dark/50 dark:text-light/50">Team Picture</span>
                            }
                        </label>
                        <input
                            onChange={handleTeamPicture}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="team_picture"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[1.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-1 transition-all duration-500 cursor-pointer text-sm px-2 rounded-md mt-1"
                >
                    {
                        teamsState.isLoading && teamsState.operation === "addTeam" ? <FaSpinner className="inline text-xl animate-spin" /> :
                            <>
                                <FaPlus className="inline text-xs mr-1 mb-0.5" />
                                {
                                    isOpenTeams ?
                                        <span className="inline text-xs md:text-sm">Create Team {teamMembers.length > 0 ? `(${teamMembers.length})` : null}</span> :
                                        <span className="hidden sm:inline text-xs md:text-sm">Create Team {teamMembers.length > 0 ? `(${teamMembers.length})` : null}</span>
                                }
                            </>
                    }
                </button>
            </form>
        </div>
    )
}
export default AddTeam