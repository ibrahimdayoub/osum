import { useState } from 'react'
import { FaBoxOpen, FaCalendarAlt, FaCubes, FaHeadset, FaScroll, FaUsers } from 'react-icons/fa'
import GetDashboardUsers from './GetDashboardUsers'
import GetDashboardServices from './GetDashboardServices'
import GetDashboardPosts from './GetDashboardPosts'
import GetDashboardTeams from './GetDashboardTeams'
import GetDashboardProjects from './GetDashboardProjects'
import GetDashBoardTasks from './GetDashBoardTasks'

const AdminDashboard = () => {
    const [sellection, setSellection] = useState("users")
    const [counter, setCounter] = useState(0)
    const [keyword, setKeyword] = useState(null)
    const [placeholder, setPlaceholder] = useState("Search user name, email and role..")
    const search = (
        <div className='flex mt-2 w-full'>
            <div className="mb-1 flex-1">
                <label htmlFor="company_name" className="sr-only">
                    Company Name
                </label>
                <input
                    value={keyword}
                    onChange={(e) => { setKeyword(e.target.value) }}
                    name="keyword"
                    className="placeholder-dark dark:placeholder-light text-dark dark:text-light bg-transparent border border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 rounded-md relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 justify-center text-dark/90 dark:text-light/90'>
                <div onClick={() => { setSellection("users"); setPlaceholder("Search user name, email and role..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "users" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaUsers className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "users" ? counter + " |" : ""} Users</span>
                        <p className=' text-center mt-2'>There are three types of accounts client, developer and delegate</p>
                        {sellection === "users" ? search : null}
                    </div>
                </div>
                <div onClick={() => { setSellection("services"); setPlaceholder("Search service name, desc and coast..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "services" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaBoxOpen className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "services" ? counter + " |" : ""} Services</span>
                        <p className=' text-center mt-2'>There are services provided by developers and delegates representing a certain company</p>
                        {sellection === "services" ? search : null}
                    </div>
                </div>
                <div onClick={() => { setSellection("posts"); setPlaceholder("Search post content and key words..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "posts" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaScroll className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "posts" ? counter + " |" : ""} Posts</span>
                        <p className=' text-center mt-2'>There are posts written by clients, developers and delegates to search for employees or work</p>
                        {sellection === "posts" ? search : null}
                    </div>
                </div>
                <div onClick={() => { setSellection("teams"); setPlaceholder("Search team name, desc and field work..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "teams" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaHeadset className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "teams" ? counter + " |" : ""} Teams</span>
                        <p className=' text-center mt-2'>There are teams that consist of developers to accomplish projects, they can be led by a developer or delegate</p>
                        {sellection === "teams" ? search : null}
                    </div>
                </div>
                <div onClick={() => { setSellection("projects"); setPlaceholder("Search project name, desc and github link..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "projects" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaCubes className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "projects" ? counter + " |" : ""} Projects</span>
                        <p className=' text-center mt-2'>There are projects requested by clients or delegates, they can be either training projects with a team or individually</p>
                        {sellection === "projects" ? search : null}
                    </div>
                </div>
                <div onClick={() => { setSellection("tasks"); setPlaceholder("Search task content and project name..") }} className={`bg-queen/75 dark:bg-king/75 ${sellection === "tasks" ? "border-2 border-dark/90 dark:border-light/90 opacity-80" : ""} hover:opacity-75 transition-opacity duration-300 cursor-pointer px-4 py-2 rounded-md shadow-inner shadow-dark/10 dark:shadow-light/10 min-h-[200px] flex flex-col sm:flex-row justify-center items-center gap-1`}>
                    <div className='flex justify-center items-center'>
                        <FaCalendarAlt className='text-6xl' />
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                        <span className=' text-2xl font-bold'> {sellection === "tasks" ? counter + " |" : ""} Tasks</span>
                        <p className=' text-center mt-2'>There are tasks that make up the project during its development</p>
                        {sellection === "tasks" ? search : null}
                    </div>
                </div>
                {/* 
                    <div className='flex mt-2'>
                        <div className="mb-1 flex-1">
                            <label htmlFor="company_name" className="sr-only">
                                Company Name
                            </label>
                            <input
                                value={keyword}
                                onChange={(e) => { setKeyword(e.target.value) }}
                                name="keyword"
                                className="placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 rounded-md relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                                placeholder="Search..."
                            />
                        </div>
                    </div> 
                */}
            </div>
            <div className='mt-4'>
                {
                    sellection === "users" ?
                        <>
                            <GetDashboardUsers setCounter={setCounter} keyword={keyword} />
                        </> :
                        sellection === "services" ?
                            <>
                                <GetDashboardServices setCounter={setCounter} keyword={keyword} />
                            </> :
                            sellection === "posts" ?
                                <>
                                    <GetDashboardPosts setCounter={setCounter} keyword={keyword} />
                                </> :
                                sellection === "teams" ?
                                    <>
                                        <GetDashboardTeams setCounter={setCounter} keyword={keyword} />
                                    </> :
                                    sellection === "projects" ?
                                        <>
                                            <GetDashboardProjects setCounter={setCounter} keyword={keyword} />
                                        </> :
                                        sellection === "tasks" ?
                                            <>
                                                <GetDashBoardTasks setCounter={setCounter} keyword={keyword} />
                                            </> :
                                            null
                }
            </div>
        </div>
    )
}
export default AdminDashboard