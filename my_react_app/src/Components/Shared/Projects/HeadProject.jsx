import { FaCrown } from "react-icons/fa"

const HeadProject = ({ currentProject }) => {
    return (
        <div className="border-queen/50 dark:border-king/50 border-b flex flex-wrap justify-between items-center px-4 py-2">
            {/*Image & Name*/}
            <div className="flex flex-wrap justify-between items-center gap-2">
                {/*Image*/}
                {
                    currentProject ?
                        <div
                            style={{ backgroundImage: `url(${currentProject.project_picture ? process.env.REACT_APP_BACK_END_URL + ((currentProject.project_picture).substring(7)).replace("\\", "/") : null})` }}
                            className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative w-14 h-14 rounded-full overflow-hidden ">
                            {
                                !currentProject.project_picture ?
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
                        currentProject ?
                            <span className="text-sm sm:text-lg text-dark dark:text-light">{currentProject.project_name}</span> :
                            <span className="text-sm sm:text-lg text-dark dark:text-light">Project Name</span>
                    }
                    <span className="text-xs text-queen dark:text-king">
                        {
                            currentProject ?
                                currentProject.project_description :
                                "Project Description"
                        }
                    </span>
                </div>
            </div>
            {/*Options*/}
            <div className="flex flex-wrap gap-1 mr-2">
            </div>
        </div>
    )
}
export default HeadProject