import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getTeams } from "../../Redux/Features/Teams/teamsSlice";
import { FaChevronDown, FaChevronRight, FaCubes, FaHeadset, FaSearchLocation, FaSearchPlus } from "react-icons/fa";
import { Tab, Dropdown, Ripple, initTE } from "tw-elements";
import Container from "../../Components/Shared/Container";
import AddTeam from '../../Components/Shared/Teams/AddTeam'
import UpdateTeam from '../../Components/Shared/Teams/UpdateTeam'
import GetTeams from '../../Components/Shared/Teams/GetTeams'
import HeadTeam from "../../Components/Shared/Teams/HeadTeam";
import InformationTeam from "../../Components/Shared/Teams/InformationTeam";
import MembersTeam from "../../Components/Shared/Teams/MembersTeam";
import AddProject from "../../Components/Shared/Projects/AddProject";
import UpdateProject from "../../Components/Shared/Projects/UpdateProject";
import GetProjects from "../../Components/Shared/Projects/GetProjects";
import { toastify } from "../../Helper";

const Teams = () => { 
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const teamsState = useSelector((state) => state.teams);
    const [isOpenTeam, setIsOpenTeam] = useState(false);
    const [isOpenTeams, setIsOpenTeams] = useState(false);
    const [updatedTeam, setUpdatedTeam] = useState("");
    const [updatedProject, setUpdatedProject] = useState("");
    const [currentTeam, setCurrentTeam] = useState("");
    const [currentProject, setCurrentProject] = useState("");
    const handleShow = () => {
        if (searchParams.get("tab") === null) {
            setSearchParams("?tab=team")
        }
        else if (searchParams.get("tab") === "team") {
            setSearchParams("?tab=teams")
        }
        else if (searchParams.get("tab") === "teams") {
            setSearchParams("")
        }
    }
    useEffect(() => {
        initTE({ Tab, Dropdown, Ripple });
    }, [])
    useEffect(() => {
        if (searchParams.get("tab") === "team") {
            setIsOpenTeam(true); setIsOpenTeams(false);
        }
        else if (searchParams.get("tab") === "teams") {
            setIsOpenTeam(false); setIsOpenTeams(true);
        }
        else {
            setIsOpenTeam(false); setIsOpenTeams(false);
        }
    }, [searchParams])
    useEffect(() => {
        // setTimeout(() => {
        dispatch(getTeams())
        // }, 100)
        if (isOpenTeams) {
            setSearchParams("?tab=team")
        }
        setUpdatedTeam("")
        setUpdatedProject("")
    }, [currentTeam])
    useEffect(() => {
        if ((Date.now() - teamsState.time < 100) && teamsState.status === 200 && teamsState.message && teamsState.operation === "getTeams") {
            toastify("success", teamsState.status, teamsState.message)
        }
        else if ((Date.now() - teamsState.time < 100) && (teamsState.status === 400 || teamsState.status === 401 || teamsState.status === 403 || teamsState.status === 404) && teamsState.message && teamsState.operation === "getTeams") {
            toastify("error", teamsState.status, teamsState.message)
        }
        else if ((Date.now() - teamsState.time < 100) && teamsState.status === 500 && teamsState.message && teamsState.operation === "getTeams") {
            toastify("warn", teamsState.status, teamsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [teamsState.status, teamsState.message, teamsState.errors])
    return (
        <Container> 
            {/* Head */}
            <div className="text-dark/75 dark:text-light/75 mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
                {/*Title*/}
                <h1 className="flex-1" style={{ letterSpacing: "2px" }}>TEAMS</h1>
            </div>
            {/* Add Team && Update Team && Search Team && Teams && Team*/}
            <div className="flex gap-2">
                {
                    isOpenTeams || (!isOpenTeam && !isOpenTeams) ?
                        <>
                            {/* Add Team && Update Team && Search Team && Teams */}
                            <div className={
                                isOpenTeams ?
                                    "bg-dark/[0.025] dark:bg-light/[0.025] relative flex-1 text-xl text-center rounded animation duration-1000 slide-in-left" :
                                    "bg-dark/[0.025] dark:bg-light/[0.025] relative w-20 sm:w-60 lg:w-80 text-xl text-center rounded animation duration-1000 slide-in-left"
                            }>
                                {
                                    isOpenTeams ?
                                        <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                        null
                                }
                                <ul className="text-dark/50 dark:text-light/50 mb-3 text-xs sm:text-base list-none flex flex-row flex-wrap" role="tablist" data-te-nav-ref>
                                    <li role="presentation" className={
                                        isOpenTeams ?
                                            "w-full xs:w-1/2" :
                                            "w-full sm:w-1/2"
                                    }>
                                        <a id="tab-new" href="#tab-new-content" className={
                                            isOpenTeams ?
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                                        } data-te-toggle="pill" data-te-target="#tab-new-content" role="tab" aria-controls="tab-new-content" data-te-nav-active aria-selected="true">
                                            {
                                                updatedTeam || updatedProject ?
                                                    <FaSearchLocation className={
                                                        isOpenTeams ?
                                                            "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                            "text-xs sm:text-base inline mb-0.5 mx-1"
                                                    } /> :
                                                    <FaSearchPlus className={
                                                        isOpenTeams ?
                                                            "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                            "text-xs sm:text-base inline mb-0.5 mx-1"
                                                    } />
                                            }
                                            <span className={
                                                isOpenTeams ?
                                                    "hidden xs:inline" :
                                                    "hidden md:inline"
                                            }>{
                                                    updatedTeam || updatedProject ?
                                                        "Update" :
                                                        "New"
                                                }</span>
                                        </a>
                                    </li>
                                    <li role="presentation" className={
                                        isOpenTeams ?
                                            "w-full xs:w-1/2" :
                                            "w-full sm:w-1/2"
                                    }>
                                        <a id="tab-teams" href="#tab-teams-content" className={
                                            isOpenTeams ?
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-2 xs:py-6 flex justify-center items-center m-0" :
                                                " data-[te-nav-active]:text-queen dark:data-[te-nav-active]:text-king data-[te-nav-active]:border-queen/50 dark:data-[te-nav-active]:border-king/50 border-dark/25 dark:border-light/25 border-b py-1 sm:py-6 flex justify-center items-center m-0"
                                        } data-te-toggle="pill" data-te-target="#tab-teams-content" role="tab" aria-controls="tab-teams-content" aria-selected="false">
                                            <FaHeadset className={
                                                isOpenTeams ?
                                                    "text-xs xs:text-base inline mb-0.5 mx-1" :
                                                    "text-xs sm:text-base inline mb-0.5 mx-1"
                                            } />
                                            <span className={
                                                isOpenTeams ?
                                                    "hidden xs:inline" :
                                                    "hidden md:inline"
                                            }>Teams</span>
                                        </a>
                                    </li>
                                </ul>
                                <div className="mb-4">
                                    {/* Add Team && Update Team && Add Project && Update Project */}
                                    <div id="tab-new-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="" data-te-tab-active>
                                        {/* Add Team && Add Project */}
                                        {
                                            !updatedTeam && !updatedProject ?
                                                <>
                                                    <AddTeam isOpenTeams={isOpenTeams} setSearchParams={setSearchParams} setCurrentTeam={setCurrentTeam} />
                                                    <AddProject location={"team"} team_id={currentTeam._id} isOpenTeams={isOpenTeams} />
                                                </> :
                                                null
                                        }
                                        {/* Update Team */}
                                        {
                                            updatedTeam ?
                                                <UpdateTeam isOpenTeams={isOpenTeams} setSearchParams={setSearchParams} currentTeam={currentTeam} setCurrentTeam={setCurrentTeam} setUpdatedTeam={setUpdatedTeam} /> :
                                                null
                                        }
                                        {/* Update Project */}
                                        {
                                            updatedProject ?
                                                <UpdateProject location="team" isOpenTeams={isOpenTeams} setSearchParams={setSearchParams} currentProject={currentProject} setUpdatedProject={setUpdatedProject} /> :
                                                null
                                        }
                                    </div>
                                    {/* Teams */}
                                    <div id="tab-teams-content" className="h-[575px] max-h-[575px] overflow-y-scroll hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                                        <GetTeams isOpenTeams={isOpenTeams} currentTeam={currentTeam} setCurrentTeam={setCurrentTeam} />
                                    </div>
                                </div>
                            </div>
                        </> :
                        null
                }
                {
                    isOpenTeam || (!isOpenTeam && !isOpenTeams) ?
                        <>
                            {/*Team*/}
                            <div className="bg-dark/[0.025] dark:bg-light/[0.025] relative h-[675px] max-h-[675px] flex-1 text-xl rounded-md animation duration-1000 slide-in-right">
                                {/*Toggle Button*/}
                                {
                                    isOpenTeam ?
                                        <button onClick={handleShow} className="absolute -left-2 top-7 cursor-pointer z-[1000]"><FaChevronRight className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                        (!isOpenTeam && !isOpenTeams) ?
                                            <button onClick={handleShow} className="absolute -left-4 top-7 cursor-pointer z-[1000]"><FaChevronDown className="text-light bg-queen dark:bg-king hover:opacity-75 w-5 h-5 p-1 rounded-full mx-auto text-sm" /></button> :
                                            null
                                }
                                {/* Head */}
                                <HeadTeam currentTeam={currentTeam} setCurrentTeam={setCurrentTeam} setUpdatedTeam={setUpdatedTeam} setSearchParams={setSearchParams} />
                                {/* Info */}
                                <InformationTeam currentTeam={currentTeam} />
                                {/* Members */}
                                <MembersTeam currentTeam={currentTeam} />
                                {/* Project */}
                                <div className="overflow-y-scroll bg-dark/[0.025] dark:bg-light/[0.025] m-2 py-2 rounded-md">
                                    <div className="flex justify-between">
                                        <h2 className="text-base text-dark dark:text-light border-dark/50 dark:border-light/50 w-fit mx-2 border-b">
                                            <FaCubes className="inline text-xl mb-1 mr-2" />
                                            Projects:
                                        </h2>
                                    </div>
                                    <div className="h-[335px] max-h-[335px] overflow-y-scroll px-2">
                                        <GetProjects location={"team"} team_id={currentTeam._id} setCurrentProject={setCurrentProject} setUpdatedProject={setUpdatedProject} setSearchParams={setSearchParams} />
                                    </div>
                                </div>
                            </div>
                        </> :
                        null
                }
            </div>
        </Container>
    )
}
export default Teams