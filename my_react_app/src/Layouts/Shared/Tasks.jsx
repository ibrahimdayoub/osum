import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronRight, FaCubes, FaSearchLocation, FaSearchPlus } from "react-icons/fa";
import { Tab, Dropdown, Ripple, initTE } from "tw-elements";
import Container from "../../Components/Shared/Container";
import AddTask from "../../Components/Shared/Tasks/AddTask";
import UpdateTask from "../../Components/Shared/Tasks/UpdateTask";
import GetProjects from "../../Components/Shared/Projects/GetProjects";
import HeadProject from "../../Components/Shared/Projects/HeadProject";
import GetTasks from "../../Components/Shared/Tasks/GetTasks";

const Projects = () => {
  const { state } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const authState = useSelector((state) => state.auth)
  const [backTo, setBackTo] = useState("") //Because tabs remove state and backTo value!
  const [projectId, setProjectId] = useState("") //Because tabs remove state and projectId value!
  const [isOpenTasks, setIsOpenTasks] = useState(false);
  const [isOpenProjects, setIsOpenProjects] = useState(false);
  const [updatedTask, setUpdatedTask] = useState("");
  const [currentProject, setCurrentProject] = useState("");
  const [currentTask, setCurrentTask] = useState("");
  const handleShow = () => {
    if (searchParams.get("tab") === null) {
      setSearchParams("?tab=tasks")
    }
    else if (searchParams.get("tab") === "tasks") {
      setSearchParams("?tab=projects")
    }
    else if (searchParams.get("tab") === "projects") {
      setSearchParams("")
    }
  }
  useEffect(() => {
    initTE({ Tab, Dropdown, Ripple });
  }, [])
  useEffect(() => {
    if (searchParams.get("tab") === "tasks") {
      setIsOpenTasks(true); setIsOpenProjects(false);
    }
    else if (searchParams.get("tab") === "projects") {
      setIsOpenTasks(false); setIsOpenProjects(true);
    }
    else {
      setIsOpenTasks(false); setIsOpenProjects(false);
    }
  }, [searchParams])
  useEffect(() => {
    setBackTo(state ? state.backTo : backTo)
    setProjectId(state ? state.projectId : projectId)
  }, [state])
  useEffect(() => {
    if (isOpenProjects) {
      setSearchParams("?tab=tasks")
    }
    setUpdatedTask("")
    setCurrentTask("")
  }, [currentProject])
  return (
    <Container>
      {/* Head */}
      <div className="text-dark/75 dark:text-light/75 mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
        {/*Title*/}
        <h1 className="flex-1" style={{ letterSpacing: "2px" }}>TASKS</h1>
        {
          backTo ?
            <>
              {/*Buttons*/}
              <div className="flex justify-between items-center gap-2 md:gap-4">
                <Link to={`/${(authState.auth.user.role).toLowerCase()}/${backTo}`}>
                  <FaChevronRight className=" hover:opacity-75 transition-all duration-500" />
                </Link>
              </div>
            </> :
            null
        }
      </div>
      {/* Add Task && Update Task && Projects && Tasks*/}
      <div className="flex gap-2 relative">
        {
          isOpenProjects || (!isOpenTasks && !isOpenProjects) ?
            <>
              {/* Add Task && Update Task && Projects */}
              <div className={
                isOpenProjects ?
                  "bg-dark/[0.025] dark:bg-light/[0.025] relative flex-1 text-xl text-center rounded animation duration-1000 slide-in-left" :
                  "bg-dark/[0.025] dark:bg-light/[0.025] relative w-20 sm:w-60 lg:w-80 text-xl text-center rounded animation duration-1000 slide-in-left"
              }>
                {
                  isOpenProjects ?
                    <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                    null
                }
                <ul className="text-dark/50 dark:text-light/50 mb-3 text-xs sm:text-base list-none flex flex-row flex-wrap" role="tablist" data-te-nav-ref>
                  <li role="presentation" className={
                    isOpenProjects ?
                      "w-full xs:w-1/2" :
                      "w-full sm:w-1/2"
                  }>
                    <a id="tab-tasks-new" href="#tab-tasks-new-content" className={
                      isOpenProjects ?
                        " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                        " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                    } data-te-toggle="pill" data-te-target="#tab-tasks-new-content" role="tab" aria-controls="tab-tasks-new-content" data-te-nav-active aria-selected="true">
                      {
                        updatedTask ?
                          <FaSearchLocation className={
                            isOpenProjects ?
                              "text-xs xs:text-base inline mb-0.5 mx-1" :
                              "text-xs sm:text-base inline mb-0.5 mx-1"
                          } /> :
                          <FaSearchPlus className={
                            isOpenProjects ?
                              "text-xs xs:text-base inline mb-0.5 mx-1" :
                              "text-xs sm:text-base inline mb-0.5 mx-1"
                          } />
                      }
                      <span className={
                        isOpenProjects ?
                          "hidden xs:inline" :
                          "hidden md:inline"
                      }>{
                          updatedTask ?
                            "Update" :
                            "New"
                        }</span>
                    </a>
                  </li>
                  <li role="presentation" className={
                    isOpenProjects ?
                      "w-full xs:w-1/2" :
                      "w-full sm:w-1/2"
                  }>
                    <a id="tab-projects" href="#tab-projects-content" className={
                      isOpenProjects ?
                        " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                        " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                    } data-te-toggle="pill" data-te-target="#tab-projects-content" role="tab" aria-controls="tab-projects-content" aria-selected="false">
                      <FaCubes className={
                        isOpenProjects ?
                          "text-xs xs:text-base inline mb-0.5 mx-1" :
                          "text-xs sm:text-base inline mb-0.5 mx-1"
                      } />
                      <span className={
                        isOpenProjects ?
                          "hidden xs:inline" :
                          "hidden md:inline"
                      }>Projects</span>
                    </a>
                  </li>
                </ul>
                <div className="mb-4">
                  {/* Add Task && Update Task */}
                  <div id="tab-tasks-new-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="" data-te-tab-active>
                    {
                      !updatedTask ?
                        <AddTask isOpenProjects={isOpenProjects} projectId={currentProject._id} /> :
                        <UpdateTask isOpenProjects={isOpenProjects} setSearchParams={setSearchParams} currentTask={currentTask} setUpdatedTask={setUpdatedTask} />
                    }
                  </div>
                  {/*Projects*/}
                  <div id="tab-projects-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                    <GetProjects location={"tasks"} isOpenProjects={isOpenProjects} currentProject={currentProject} setCurrentProject={setCurrentProject} />
                  </div>
                </div>
              </div>
            </> :
            null
        }
        {
          isOpenTasks || (!isOpenTasks && !isOpenProjects) ?
            <>
              {/*Tasks*/}
              <div className="bg-dark/[0.025] dark:bg-light/[0.025] relative h-[675px] max-h-[675px] flex-1 text-xl rounded-md animation duration-1000 slide-in-right">
                {/*Toggle Button*/}
                {
                  isOpenTasks ?
                    <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                    (!isOpenTasks && !isOpenProjects) ?
                      <button onClick={handleShow} className="absolute -left-4 top-7 cursor-pointer z-[1000]"><FaChevronDown className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                      null
                }
                {/* Head */}
                <HeadProject currentProject={currentProject} />
                {/* Tasks */}
                <GetTasks project_id={currentProject._id} setCurrentTask={setCurrentTask} setUpdatedTask={setUpdatedTask} setSearchParams={setSearchParams} />
              </div>
            </> :
            null
        }
      </div >
    </Container>
  )
}
export default Projects