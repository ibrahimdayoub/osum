import { FaCrown, FaList } from "react-icons/fa"
import { Link } from "react-router-dom"

const GetUsers = ({ users }) => {
    return (
        users.length > 0 ?
            users.map((user) => {
                return (
                    <Link
                        to={`../profile/${user._id}`} state={{ backTo: "search", targetRole: user.role }}
                        className="bg-dark/[0.025] dark:bg-light/[0.025] hover:opacity-75 flex items-center px-2 py-1 mb-0.5 gap-2 rounded-md transition-all duration-300 cursor-pointer" >
                        <div
                            style={{ backgroundImage: `url(${user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((user.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-12 h-12 rounded-full overflow-hidden ">
                            {
                                !user.picture_personal_profile ?
                                    <FaCrown className="text-2xl absolute top-3 left-3" /> :
                                    null
                            }
                        </div>
                        <div className="flex-1 flex flex-col" >
                            <div className="w-full flex items-center text-left">
                                <span className="text-dark dark:text-light flex-1 text-sm truncate w-2">
                                    {`${user.first_name} ${user.last_name}`}
                                </span>
                            </div>
                            <div className="w-full flex items-center text-left">
                                <span className=
                                    "text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2">
                                    {user.role}
                                </span>
                            </div>
                            <div className="w-full flex items-center text-left">
                                <span className="text-dark/50 dark:text-light/50 flex-1 text-xs truncate w-2">
                                    {user.email}
                                </span>
                            </div>
                        </div>
                    </Link>
                )
            }) :
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up">
                <FaList className="inline mb-1 mr-2" />
                No users found
            </div>
    )
}
export default GetUsers