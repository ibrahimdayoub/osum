import { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggle } from "../../Redux/Features/Theme/themeSlice";
import { FaBars, FaCrown, FaHome, FaChevronLeft, FaChevronRight, FaLaptopMedical, FaLaptop, FaLaptopCode, FaSun, FaMoon, FaChevronDown, FaSignInAlt } from "react-icons/fa";
import { Sidenav, initTE } from "tw-elements";

const SideNavStop = () => {
    const dispatch = useDispatch();
    const themeState = useSelector((state) => state.theme);
    const [isOpen, setIsOpen] = useState(true)
    useEffect(() => {
        initTE({ Sidenav });
        document
            .getElementById("slim-toggler")
            .addEventListener("click", () => {
                const instance = Sidenav.getInstance(
                    document.getElementById("sidenav-4")
                );
                instance.toggleSlim();
            });
    }, [])

    return (
        <>
            {/* Sidenav */}
            <nav id="sidenav-4" className="bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark border-r border-queen/25 dark:border-king/25 group fixed left-0 top-0 z-[1035] h-screen w-60 -translate-x-full overflow-hidden data-[te-sidenav-slim='true']:hidden data-[te-sidenav-slim-collapsed='true']:w-[60px] data-[te-sidenav-slim='true']:w-[60px] data-[te-sidenav-hidden='false']:translate-x-0 [&[data-te-sidenav-slim-collapsed='true'][data-te-sidenav-slim='false']]:hidden [&[data-te-sidenav-slim-collapsed='true'][data-te-sidenav-slim='true']]:[display:unset]" data-te-sidenav-init data-te-sidenav-hidden="false" data-te-sidenav-mode="side" data-te-sidenav-slim="true" data-te-sidenav-content="#slim-content" data-te-sidenav-slim-collapsed="true">
                <h1 className="px-[0.15rem] mt-2" style={{ letterSpacing: 1 }}>
                    <Link to="home" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-10 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                        <FaCrown className="inline text-2xl mb-1" />
                        <span className="font-bold text-2xl ml-2 group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">OSUM</span>
                    </Link>
                </h1>
                {/*Break*/}
                <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                <ul data-te-sidenav-menu-ref className="relative m-0 list-none px-[0.2rem]">
                    {/*Home*/}
                    <li className="relative">
                        <Link to="home" className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaHome className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Home</span>
                        </Link>
                    </li>
                    {/*Support Group*/}
                    <li className="relative">
                        <div className="text-dark/75 dark:text-light/75 hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-8 cursor-pointer items-center truncate rounded-[5px] px-6 py-2 text-[0.875rem] transition duration-500 ease-linear outline-none hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none " data-te-sidenav-link-ref>
                            <FaSignInAlt className="mr-2 mb-1 text-xl" />
                            <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Enter</span>
                            <FaChevronDown className="absolute right-0 ml-auto mr-[0.5rem] transition-transform duration-500 ease-linear motion-reduce:transition-none text-md" data-te-sidenav-rotate-icon-ref />
                        </div>
                        <ul className="!visible relative m-0 hidden list-none p-0 data-[te-collapse-show]:block " data-te-sidenav-collapse-ref>
                            {/*Inner Link*/}
                            <li className="relative">
                                <Link to="sign-up" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    <FaLaptopCode className="mr-2 mb-1 text-md" />
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Sign Up</span>
                                </Link>
                            </li>
                            {/*Inner Link*/}
                            <li className="relative">
                                <Link to="sign-in" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                    <FaLaptopMedical className="mr-2 mb-1 text-md" />
                                    <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Sign In</span>
                                </Link>
                            </li>
                            {/*Inner Link*/}
                            {/* 
                                <li className="relative">
                                    <Link to="forgot-password" className="text-queen dark:text-king hover:bg-dark/10 dark:hover:bg-light/10 focus:bg-dark/10 dark:focus:bg-white/10 active:bg-dark/10 dark:active:bg-white/10 flex h-6 cursor-pointer items-center truncate rounded-[5px] py-4 pl-[3.4rem] pr-6 text-[0.78rem] outline-none transition duration-500 ease-linear hover:outline-none focus:outline-none active:outline-none data-[te-sidenav-state-focus]:outline-none motion-reduce:transition-none" data-te-sidenav-link-ref>
                                        <FaLaptop className="mr-2 mb-1 text-md" />
                                        <span className="group-[&[data-te-sidenav-slim-collapsed='true']]:data-[te-sidenav-slim='false']:hidden" data-te-sidenav-slim="false">Forgot Password</span>
                                    </Link>
                                </li>
                            */}
                        </ul>
                    </li>
                    {/*Break*/}
                    <hr className="my-2 border-none bg-queen/25 dark:bg-king/25" style={{ height: "0.5px" }} />
                </ul>
            </nav>
            {/* Togglers */}
            <div id="slim-content" className="border-queen/25 dark:border-king/25 flex !pl-[77px] fixed border-b border-r rounded-b">
                {/* Toggler */}
                <button className={isOpen ? "text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-4 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" : "hidden"} aria-haspopup="true" id="slim-toggler">
                    <FaBars className="text-md" />
                </button>
                {/* Toggler */}
                <button onClick={() => setIsOpen(!isOpen)} className="text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-4 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" data-te-sidenav-toggle-ref data-te-target="#sidenav-4" aria-controls="#sidenav-4" aria-haspopup="true">
                    {
                        isOpen ?
                            <FaChevronLeft className="text-md" /> :
                            <FaChevronRight className="text-md" />
                    }
                </button>
                {/* Toggler */}
                <button onClick={() => { dispatch(toggle()) }} className="text-dark/75 dark:text-light/75 bg-light dark:bg-dark bg-gradient-to-br from-queen/10 to-light dark:from-king/10 dark:to-dark hover:bg-dark/10 dark:hover:bg-light/10 inline-block px-4 py-2 text-xs font-medium uppercase leading-tight transition duration-500 ease-in-out" aria-haspopup="true">
                    {
                        themeState.theme === "dark" ?
                            <FaSun /> :
                            <FaMoon />
                    }
                </button>
            </div>
            <Outlet />
        </>
    );
}
export default SideNavStop;