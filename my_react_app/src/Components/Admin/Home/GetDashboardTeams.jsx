import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteTeam, getDashboardTeams } from "../../../Redux/Features/Teams/teamsSlice";
import { FaCrown, FaSpinner, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const GetDashboardTeams = ({ setCounter, keyword }) => {
    const dispatch = useDispatch();
    const teamsState = useSelector((state) => state.teams);
    const [searchResults, setSearchResults] = useState(null)
    const deleteTeamSubmit = (teamId) => {
        dispatch(deleteTeam({ id: teamId }))
    }
    useEffect(() => {
        dispatch(getDashboardTeams())
    }, [])
    useEffect(() => {
        const regex = new RegExp(keyword, "i")
        setSearchResults(
            teamsState.teams.filter((team) => {
                return regex.test(team.team_name) || regex.test(team.team_description)
            })
        )
    }, [keyword])
    useEffect(() => {
        setCounter(searchResults?.length ? searchResults.length : teamsState.teams.length)
    }, [searchResults])
    return (
        (searchResults?.length > 0 ? searchResults : teamsState.teams).map((team) => {
            return (
                <div className="mb-2 bg-dark/[0.025] dark:bg-light/[0.025] rounded-md p-2">
                    <div className=" text-sm py-2 lg:flex flex-wrap items-center justify-between ">
                        <div className="flex-1 flex flex-col items-start" >
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Team Name:</span>
                                <span className="text-dark/50 dark:text-light/50">{team.team_name}</span>
                            </p>
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Team Description:</span>
                                <span className="text-dark/50 dark:text-light/50">{team.team_description}</span>
                            </p>
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Team Leader:</span>
                                <span className="text-dark/50 dark:text-light/50">{`${team.leader_id.first_name} ${team.leader_id.last_name}`}</span>
                            </p>
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Work Field:</span>
                                <span className="text-dark/50 dark:text-light/50">{team.field_of_work}</span>
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col ">
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Memembers:</span>
                                <span className="text-dark/50 dark:text-light/50">{team.members_ids.length} Developers</span>
                            </p>
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Rate:</span>
                                <span className="text-dark/50 dark:text-light/50">{team.team_rate}/7 (avg members rates)</span>
                            </p>
                            <p className="mx-2">
                                <span className=" text-dark dark:text-light mr-1">Created:</span>
                                <span className="text-dark/50 dark:text-light/50">{format(new Date(team.createdAt), 'dd/MM/yyyy')}</span>
                            </p>
                            <button onClick={() => { deleteTeamSubmit(team._id) }} className="ml-2 my-2">
                                {
                                    (teamsState.isLoading && teamsState.operation === "deletePost") ? <FaSpinner className="inline text-base ml-1" /> :
                                        <>
                                            <FaTrash className="text-queen dark:text-king hover:opacity-80 transition-opacity duration-300 text-lg" />
                                        </>
                                }
                            </button>
                        </div>
                    </div >
                    <div className="border-t border-queen/50 dark:border-king/50 h-[75px] max-h-[75px] overflow-y-scroll py-1.5 grid lg:grid-cols-2 gap-1">
                        {
                            team.members_ids.map((member) => {
                                return (
                                    <div className="bg-dark/[0.025] dark:bg-light/[0.025] p-1 rounded-md flex flex-wrap items-center justify-between h-fit">
                                        <div
                                            className="flex gap-2 flex-wrap">
                                            <div
                                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                                                <FaCrown className="text-2xl absolute top-4 left-4" />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <span className="text-dark dark:text-light mr-1 text-sm">{`${member.first_name} ${member.last_name}`}</span>
                                                <span className="text-queen dark:text-king mr-1 text-xs">{member.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            )
        })
    )
}
export default GetDashboardTeams