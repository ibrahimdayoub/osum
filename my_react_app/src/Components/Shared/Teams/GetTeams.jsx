import { useSelector } from 'react-redux';
import { FaCrown } from "react-icons/fa"

const GetTeams = ({ isOpenTeams, currentTeam, setCurrentTeam }) => {
    const teamsState = useSelector((state) => state.teams);
    return (teamsState.teams.length === 0 ?
        <div className="text-dark/50 dark:text-light/50 text-center text-xs sm:text-lg px-4 py-10 h-full">
            Create team to work...
        </div> :
        <>
            {
                teamsState.teams.map((team) => {
                    return (
                        <div onClick={() => { setCurrentTeam(team) }} className={
                            isOpenTeams ?
                                `${team._id === currentTeam._id ? "border border-queen/25 dark:border-king/25" : null} xs:bg-dark/[0.025] dark:xs:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer` :
                                `${team._id === currentTeam._id ? "border border-queen/25 dark:border-king/25" : null} sm:bg-dark/[0.025] dark:sm:bg-light/[0.025] hover:opacity-75 relative xs:flex items-center px-2 py-1 mb-0.5 ml-1 xs:gap-2 rounded-full xs:rounded-sm sm:rounded-md transition-all duration-300 cursor-pointer`
                        }>
                            <div
                                style={{ backgroundImage: `url(${team.team_picture ? process.env.REACT_APP_BACK_END_URL + ((team.team_picture).substring(7)).replace("\\", "/") : null})` }}
                                className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden mx-auto">
                                {
                                    !team.team_picture ?
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
                                    <span className="text-dark dark:text-light flex-1 text-sm truncate w-2">{team.team_name}</span>
                                </div>
                                <div className="w-full flex text-left items-center">
                                    <div className="flex-1 flex truncate w-2" style={{ lineHeight: "0px" }}>
                                        <span className="text-queen dark:text-king text-xs truncate max-w-[75%]">{team.team_description}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}
export default GetTeams