import { FaCrown, FaList, FaUserFriends } from "react-icons/fa"
import { Link } from "react-router-dom"

const MembersTeam = ({ currentTeam }) => {
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] m-2 py-2 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-base text-dark dark:text-light border-dark/50 dark:border-light/50 w-fit mx-2 border-b">
                    <FaUserFriends className="inline text-xl mb-1 mr-2" />
                    Members:
                </h2>
            </div>
            {
                !currentTeam ?
                    <div className="min-h-[75px] text-dark/50 dark:text-light/50 text-base mx-2 pb-2 flex items-center justify-center rounded-md">
                        Select team to disply team members...
                    </div> :
                    currentTeam.members_ids.length > 0 ?
                        <div className="h-[75px] max-h-[75px] overflow-y-scroll px-2 py-1.5 grid lg:grid-cols-2 gap-1">
                            {
                                currentTeam.members_ids.map((member) => {
                                    return (
                                        <div className="bg-dark/[0.025] dark:bg-light/[0.025] p-1 rounded-md flex flex-wrap items-center justify-between h-fit">
                                            <Link
                                                to={`../profile/${member._id}`} state={{ backTo: "teams", targetRole:member.role }}
                                                className="flex gap-2 flex-wrap">
                                                <div
                                                    className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                                                    <FaCrown className="text-2xl absolute top-4 left-4" />
                                                </div>
                                                <div className="flex flex-col justify-center">
                                                    <span className="text-dark dark:text-light mr-1 text-sm">{`${member.first_name} ${member.last_name}`}</span>
                                                    <span className="text-queen dark:text-king mr-1 text-xs">{member.email}</span>
                                                </div>
                                            </Link>
                                        </div>
                                    )
                                })
                            }
                        </div> :
                        <div className="min-h-[75px] pb-2 text-dark/50 dark:text-light/50 h-full flex justify-center items-center text-base animation duration-1000 slide-in-up">
                            <span>
                                <FaList className="inline mb-1 mr-2" />
                                No members found
                            </span>
                        </div>
            }
        </div>
    )
}
export default MembersTeam