import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardUsers, blockUser, deleteUser } from "../../../Redux/Features/Users/usersSlice";
import { FaAddressCard, FaChartLine, FaCrown, FaHandPaper, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';

const GetDashboardUsers = ({ setCounter, keyword }) => {
    const dispatch = useDispatch();
    const usersState = useSelector((state) => state.users);
    const [searchResults, setSearchResults] = useState(null)
    const blockUserSubmit = (UserId) => {
        dispatch(blockUser({ id: UserId }))
    }
    const deleteUserSubmit = (UserId, UserRole) => {
        dispatch(deleteUser({ id: UserId, data: { role: UserRole } }))
    }
    useEffect(() => {
        dispatch(getDashboardUsers())
    }, [])
    useEffect(() => {
        const regex = new RegExp(keyword, "i")
        setSearchResults(
            usersState.users.filter((user) => {
                return regex.test(user.email) || regex.test(`${user.first_name} ${user.last_name}`) || regex.test(user.role)
            })
        )
    }, [keyword])
    useEffect(() => {
        setCounter(searchResults?.length ? searchResults.length : usersState.users.length)
    }, [searchResults])
    return (
        (searchResults?.length > 0 ? searchResults : usersState.users).map((user) => {
            return (
                <div className="bg-dark/[0.025] dark:bg-light/[0.025] mb-2 py-2 relative text-center sm:flex flex-wrap items-center justify-start rounded-md">
                    {/*Picture*/}
                    <div
                        style={{ backgroundImage: `url(${user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((user.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
                        className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative mx-auto sm:mx-6 my-2 w-36 h-36 rounded-full overflow-hidden">
                        {
                            !user.picture_personal_profile ?
                                <FaCrown className="text-6xl absolute top-10 left-10" /> :
                                null
                        }
                    </div>
                    {/*Personal*/}
                    <div className="mx-4 sm:mx-0 flex-grow text-start sm:flex items-start justify-start flex-col px-2 mt-4 sm:mt-0 text-sm">
                        <h2 className="text-lg text-dark dark:text-light mb-2 border-b border-dark/50 dark:border-light/50">
                            <FaAddressCard className="inline text-xl mb-1 mr-2" />
                            Personal Info:
                        </h2>
                        <p className="ml-1">
                            <span className=" text-dark dark:text-light mr-1">Name:</span>
                            <span className="text-dark/50 dark:text-light/50">{`${user.first_name} ${user.last_name}`}</span>
                        </p>
                        <p className="ml-1">
                            <span className=" text-dark dark:text-light mr-1">Address:</span>
                            <span className="text-dark/50 dark:text-light/50">{user.address}</span>
                        </p>
                        <p className="ml-1">
                            <span className=" text-dark dark:text-light mr-1">Email:</span>
                            <span className="text-dark/50 dark:text-light/50">{user.email}</span>
                        </p>
                        {
                            user.role === "Developer" || user.role === "Delegate" ?
                                <p className="ml-1">
                                    <span className=" text-dark dark:text-light mr-1">Github:</span>
                                    <a href={user.github_link} target="_blank" className="text-dark/50 dark:text-light/50" rel="noreferrer">{user.github_link}</a>
                                </p> :
                                null
                        }
                        <p className="ml-1">
                            <span className=" text-dark dark:text-light mr-1">Role:</span>
                            <span className="text-dark/50 dark:text-light/50">{user.role}</span>
                        </p>
                        {
                            user.role !== "Admin" ?
                                <p className="ml-1">
                                    <span className=" text-dark dark:text-light mr-1">Work Field:</span>
                                    <span className="text-dark/50 dark:text-light/50">{user.field_of_work}</span>
                                </p> :
                                null
                        }
                    </div>
                    {/*Account*/}
                    <div className="mx-4 sm:mx-0 flex-grow text-start sm:flex items-start justify-start flex-col px-2 mt-4 sm:mt-0 text-sm">
                        <h2 className=" text-lg text-dark dark:text-light mb-2 border-b border-dark/50 dark:border-light/50">
                            <FaChartLine className="inline text-xl mb-1 mr-2" />
                            Account Info:
                        </h2>
                        {
                            user.role !== "Admin" ?
                                <>
                                    <p className="ml-1">
                                        <span className=" text-dark dark:text-light mr-1">Views:</span>
                                        <span className="text-dark/50 dark:text-light/50">{user.views_personal_profile}</span>
                                    </p>
                                    <p className="ml-1">
                                        <span className=" text-dark dark:text-light mr-1">Rate:</span>
                                        <span className="text-dark/50 dark:text-light/50">
                                            {
                                                user.rate_personal_profile.length > 0 ?
                                                    Math.round((user.rate_personal_profile.reduce((counter, object) => { return counter + object.rate }, 0)) / user.rate_personal_profile.length)
                                                    : 0
                                            }/7
                                            {
                                                user.rate_personal_profile.length ?
                                                    <span> ({user.rate_personal_profile.length} votes) </span> :
                                                    <span> (0 votes) </span>
                                            }

                                        </span>
                                    </p>
                                </> :
                                null
                        }
                        <p className="ml-1">
                            <span className=" text-dark dark:text-light mr-1">Created:</span>
                            <span className="text-dark/50 dark:text-light/50">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
                        </p>
                        {
                            user.end_block_date ?
                                <p className="ml-1">
                                    <span className=" text-dark dark:text-light mr-1">Blocked:</span>
                                    <span className="text-dark/50 dark:text-light/50">{format(new Date(user.end_block_date), 'dd/MM/yyyy')}</span>
                                </p> :
                                null
                        }

                        <div className='flex justify-between items-center mt-4'>
                            <button title={user.end_block_date ? "unBlock" : "Block"} onClick={() => { blockUserSubmit(user._id) }}>
                                <FaHandPaper className="text-lg mb-1 mr-1 text-queen dark:text-king hover:opacity-80 transition-opacity duration-300" />
                            </button>
                            <button title='Delete' onClick={() => { deleteUserSubmit(user._id, user.role) }}>
                                <FaTrash className="text-lg mb-1 mr-1 text-queen dark:text-king hover:opacity-80 transition-opacity duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            )
        })
    )
}
export default GetDashboardUsers