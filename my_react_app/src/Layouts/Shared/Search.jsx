import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers } from "../../Redux/Features/Users/usersSlice";
import { searchPosts } from "../../Redux/Features/Posts/postsSlice";
import { searchServices } from "../../Redux/Features/Services/servicesSlice";
import { searchProjects } from "../../Redux/Features/Projects/projectsSlice";
import { FaChevronRight, FaRoute, FaSearch, FaSpinner } from "react-icons/fa";
import Container from "../../Components/Shared/Container";
import GetUsers from "../../Components/Shared/Users/GetUsers";
import GetPosts from "../../Components/Shared/Posts/GetPosts";
import GetServices from "../../Components/Shared/Services/GetServices";
import GetProjects from "../../Components/Shared/Projects/GetProjects";
import { toastify } from "../../Helper";

const Search = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const usersState = useSelector((state) => state.users);
    const postsState = useSelector((state) => state.posts);
    const servicesState = useSelector((state) => state.services);
    const projectsState = useSelector((state) => state.projects);
    const [searchInput, setSearchInput] = useState({
        key: "",
        about: ""
    });
    const [showResult, setShowResult] = useState(false)
    const handleSearchInput = (e) => {
        e.persist();
        setSearchInput({ ...searchInput, [e.target.name]: e.target.value });
        setShowResult(false)
    };
    const searchSubmit = (e) => {
        e.preventDefault();
        const data = {
            key: searchInput.key,
        }
        if (searchInput.about === "Users") {
            dispatch(searchUsers(data))
            setShowResult(true)
        }
        else if (searchInput.about === "Posts") {
            dispatch(searchPosts(data))
            setShowResult(true)
        }
        else if (searchInput.about === "Services") {
            dispatch(searchServices(data))
            setShowResult(true)
        }
        else if (searchInput.about === "Projects") {
            dispatch(searchProjects(data))
            setShowResult(true)
        }
    }
    useEffect(() => {
        if ((Date.now() - usersState.time < 100) && usersState.status === 200 && usersState.message && usersState.operation === "searchUsers") {
            toastify("success", usersState.status, usersState.message)
            setShowResult(true)
        }
        else if ((Date.now() - usersState.time < 100) && (usersState.status === 401 || usersState.status === 403 || usersState.status === 404) && usersState.message && usersState.operation === "searchUsers") {
            toastify("error", usersState.status, usersState.message)
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 500 && usersState.message && usersState.operation === "searchUsers") {
            toastify("warn", usersState.status, usersState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [usersState.status, usersState.message])
    useEffect(() => {
        if ((Date.now() - postsState.time < 100) && postsState.status === 200 && postsState.message && postsState.operation === "searchPosts") {
            toastify("success", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && (postsState.status === 401 || postsState.status === 403 || postsState.status === 404) && postsState.message && postsState.operation === "searchPosts") {
            toastify("error", postsState.status, postsState.message)
        }
        else if ((Date.now() - postsState.time < 100) && postsState.status === 500 && postsState.message && postsState.operation === "searchPosts") {
            toastify("warn", postsState.status, postsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [postsState.status, postsState.message])
    useEffect(() => {
        if ((Date.now() - servicesState.time < 100) && servicesState.status === 200 && servicesState.message && servicesState.operation === "searchServices") {
            toastify("success", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && (servicesState.status === 401 || servicesState.status === 403 || servicesState.status === 404) && servicesState.message && servicesState.operation === "searchServices") {
            toastify("error", servicesState.status, servicesState.message)
        }
        else if ((Date.now() - servicesState.time < 100) && servicesState.status === 500 && servicesState.message && servicesState.operation === "searchServices") {
            toastify("warn", servicesState.status, servicesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [servicesState.status, servicesState.message])
    useEffect(() => {
        if ((Date.now() - projectsState.time < 100) && projectsState.status === 200 && projectsState.message && projectsState.operation === "searchProjects") {
            toastify("success", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && (projectsState.status === 401 || projectsState.status === 403 || projectsState.status === 404) && projectsState.message && projectsState.operation === "searchProjects") {
            toastify("error", projectsState.status, projectsState.message)
        }
        else if ((Date.now() - projectsState.time < 100) && projectsState.status === 500 && projectsState.message && projectsState.operation === "searchProjects") {
            toastify("warn", projectsState.status, projectsState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [projectsState.status, projectsState.message])
    return (
        <Container>
            {/* Head */}
            <div className="text-dark/75 dark:text-light/75  mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
                {/*Title*/}
                <h1 className="flex-1" style={{ letterSpacing: "2px" }}>SEARCH</h1>
                {/*Buttons*/}
                <div className="flex justify-between items-center gap-2 md:gap-4">
                    <Link to={`/${(authState.auth.user.role).toLowerCase()}/home`}>
                        <FaChevronRight className=" hover:opacity-75 transition-all duration-500" />
                    </Link>
                </div>
            </div>
            {/* Body */}
            <div className='bg-dark/[0.025] dark:bg-light/[0.025] p-4 my-2 rounded-md'>
                <h2 className="text-dark dark:text-light text-base">
                    <FaRoute className="inline text-lg mr-2" />
                    Give any key and receive our results:
                </h2>
                <form enctype="multipart/form-data" onSubmit={(e) => { searchSubmit(e) }} className="max-w-5xl mx-auto">
                    <div className="my-2">
                        <div className="mb-1">
                            <select
                                value={searchInput.about}
                                onChange={handleSearchInput}
                                name="about"
                                className={
                                    false ?
                                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger/50 dark:text-danger/50 bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                }
                            >
                                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Search about ?</option>
                                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Users</option>
                                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Posts</option>
                                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Services</option>
                                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Projects</option>
                            </select>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="key" className="sr-only">
                                Content
                            </label>
                            <input
                                value={searchInput.key}
                                onChange={handleSearchInput}
                                name="key"
                                type="text"
                                className={
                                    false ?
                                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                }
                                placeholder={false ? "" : "Keyword"}
                            />
                        </div>
                    </div>
                    <div className='flex justify-end'>
                        <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                            {
                                (
                                    (searchInput.about === "Users" && usersState.isLoading && usersState.operation === "searchUsers") ||
                                    (searchInput.about === "Posts" && postsState.isLoading && postsState.operation === "searchPosts")
                                ) ? <FaSpinner className="inline text-xs mr-1 mb-0.5 animate-spin" /> :
                                    <>
                                        <FaSearch className="inline text-xs mr-1 mb-0.5" />
                                        Search
                                    </>
                            }
                        </button>
                    </div>
                </form>
            </div>
            <div>
                {
                    searchInput.about === "Users" && showResult ?
                        <GetUsers users={usersState.users} /> :
                        searchInput.about === "Posts" && showResult ?
                            <GetPosts location={"search"} posts={postsState.posts} /> :
                            searchInput.about === "Services" && showResult ?
                                <GetServices location={"search"} projects={servicesState.services} /> :
                                searchInput.about === "Projects" && showResult ?
                                    <GetProjects location={"search"} projects={projectsState.projects} /> :
                                    null
                }
            </div>
        </Container>
    )
}
export default Search