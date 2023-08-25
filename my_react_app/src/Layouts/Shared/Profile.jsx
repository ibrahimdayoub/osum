import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { set, signOut } from '../../Redux/Features/Auth/authSlice';
import { getUser, visitUser } from '../../Redux/Features/Users/usersSlice';
import { FaBoxOpen, FaChevronRight, FaCubes, FaList, FaPlus, FaScroll, FaShieldAlt, FaSignOutAlt, FaSpinner, FaTrash } from 'react-icons/fa';
import { Tab, Dropdown, Ripple, initTE } from "tw-elements";
import Container from "../../Components/Shared/Container";
import InformationProfile from "../../Components/Shared/Profile/InformationProfile";
import UpdateProfile from '../../Components/Shared/Profile/UpdateProfile';
import DeleteProfile from '../../Components/Shared/Profile/DeleteProfile';
import SupportProfile from '../../Components/Shared/Profile/SupportProfile';
import GetStories from '../../Components/Shared/Stories/GetStories';
import AddPost from "../../Components/Shared/Posts/AddPost";
import GetPosts from "../../Components/Shared/Posts/GetPosts";
import AddProject from '../../Components/Shared/Projects/AddProject';
import GetProjects from '../../Components/Shared/Projects/GetProjects';
import AddCompany from '../../Components/Delegate/Company/AddCompany';
import GetCompany from '../../Components/Delegate/Company/GetCompany';
import AddService from '../../Components/Shared/Services/AddService';
import GetServices from '../../Components/Shared/Services/GetServices';
import { confirmModal } from '../../Helper';
import AddAdmin from '../../Components/Admin/Admins/AddAdmin';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { state } = useLocation();
  const { id } = useParams()
  const authState = useSelector((state) => state.auth)
  const usersState = useSelector((state) => state.users)
  const [user, setUser] = useState({})
  const [backTo, setBackTo] = useState("") //Because tabs remove state and backTo value!
  const [targetRole, setTargetRole] = useState("") //Because tabs remove state and targetRole value!
  const [openSignOutModal, setOpenSignOutModal] = useState(false);
  //SignOut
  const signOutSubmit = () => {
    dispatch(signOut())
    setTimeout(() => {
      navigate(0)
    }, 2500);
  }
  useEffect(() => {
    initTE({ Tab, Dropdown, Ripple });
    setBackTo(state ? state.backTo : backTo)
    setTargetRole(state ? state.targetRole : targetRole)
    if (authState.auth.user._id !== id) {
      const data = {
        role: state?.targetRole
      }
      dispatch(visitUser({ id, data }))
    }
    dispatch(getUser({ id, data: { role: state?.targetRole || targetRole || authState.auth.user.role } }))
  }, [id, state?.targetRole])
  useEffect(() => {
    // setTimeout(() => {
    // setUser(
    //   (usersState.users.filter((user) => {
    //     return user._id === id
    //   }))[0]
    // )
    // }, 1000);
    const user_ = (usersState.users.filter((user) => {
      return user._id === id
    }))[0]
    setUser(user_)
    if (authState.auth.user._id === user_?._id) {
      dispatch(set({
        user: user_,
        operation: "updateUser"
      }))
    }
  }, [usersState.users])
  return (
    <Container>
      {/* Head */}
      <div className="text-dark/75 dark:text-light/75  mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
        {/*Title*/}
        <h1 className="flex-1" style={{ letterSpacing: "2px" }}>PROFILE</h1>
        {
          authState.auth.user._id !== id ?
            <>
              {/*Buttons*/}
              <div className="flex justify-between items-center gap-2 md:gap-4">
                <Link to={`/${(authState.auth.user.role).toLowerCase()}/${backTo}`}>
                  <FaChevronRight className=" hover:opacity-75 transition-all duration-500" />
                </Link>
              </div>
            </> :
            <button
              title='SignOut'
              onClick={() => { /*signOutSubmit()*/ setOpenSignOutModal(true) }}
              className="text-dark dark:text-light  hover:opacity-75 transition-all duration-500 "
            >
              {
                authState.isLoading && authState.operation === "signOut" ?
                  <FaSpinner className="inline text-xl mr-2 animate-spin" /> :
                  <FaSignOutAlt className="inline text-xl mr-2" />
              }
            </button>
        }
      </div>
      {/* Body */}
      {
        authState.auth.user._id === id ?
          <>
            {/* Information */}
            <InformationProfile user={authState.auth.user} />
            {/* Control */}
            <div className='mb-2'>
              <ul className="text-dark/50 dark:text-light/50 text-xs list-none flex flex-row flex-wrap gap-2" role="tablist" data-te-nav-ref>
                <li role="presentation" className="flex-1">
                  <a id="tab-update" href="#tab-update-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-update-content" role="tab" aria-controls="tab-update-content" aria-selected="false">
                    <FaScroll className="text-xs sm:text-base inline mb-0.5 mx-2" />
                    <span className="hidden xs:inline">Update</span>
                  </a>
                </li>
                <li role="presentation" className="flex-1">
                  <a id="tab-delete" href="#tab-delete-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-delete-content" role="tab" aria-controls="tab-delete-content" aria-selected="false">
                    <FaTrash className="text-xs sm:text-base inline mb-0.5 mx-2" />
                    <span className="hidden xs:inline">Delete</span>
                  </a>
                </li>
                <li role="presentation" className="flex-1">
                  <a id="tab-support" href="#tab-support-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-support-content" role="tab" aria-controls="tab-support-content" aria-selected="false">
                    {
                      authState.auth.user.role !== "Admin" ?
                        <>
                          <FaShieldAlt className="text-xs sm:text-base inline mb-0.5 mx-2" />
                          <span className="hidden xs:inline">Support</span>
                        </> :
                        <>
                          <FaPlus className="text-xs sm:text-base inline mb-0.5 mx-2" />
                          <span className="hidden xs:inline">Add Admin</span>
                        </>
                    }
                  </a>
                </li>
              </ul>
              <div>
                {/* Update */}
                <div id="tab-update-content" className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                  <UpdateProfile user={authState.auth.user} />
                </div>
                {/* Delete */}
                <div id="tab-delete-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                  <DeleteProfile user={authState.auth.user} />
                </div>
                {/* Support || Add Admin */}
                {
                  authState.auth.user.role !== "Admin" ?
                    <div id="tab-support-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                      <SupportProfile user={authState.auth.user} />
                    </div> :
                    <div id="tab-support-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                      <AddAdmin />
                    </div>
                }
              </div>
            </div>
            {
              authState.auth.user.role !== "Admin" ?
                <>
                  {/* Stories */}
                  <GetStories location={"my_profile"} />
                  {
                    authState.auth.user.role === "Delegate" ?
                      <>
                        {
                          authState.auth.user.company_id ?
                            <GetCompany companyId={authState.auth.user.company_id} /> :
                            <AddCompany />
                        }
                      </> :
                      null
                  }
                  <ul className="text-dark/50 dark:text-light/50 text-xs list-none flex flex-row flex-wrap gap-2" role="tablist" data-te-nav-ref>
                    <li role="presentation" className="flex-1">
                      <a id="tab-posts" href="#tab-posts-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-posts-content" role="tab" aria-controls="tab-posts-content" data-te-nav-active aria-selected="true">
                        <FaScroll className="text-xs sm:text-base inline mb-0.5 mx-2" />
                        <span className="hidden xs:inline">Posts</span>
                      </a>
                    </li>
                    {
                      authState.auth.user.role === "Developer" || authState.auth.user.role === "Delegate" ?
                        <li role="presentation" className="flex-1">
                          <a id="tab-services" href="#tab-services-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-services-content" role="tab" aria-controls="tab-services-content" aria-selected="false">
                            <FaBoxOpen className="text-xs sm:text-base inline mb-0.5 mx-2" />
                            <span className="hidden xs:inline">Services</span>
                          </a>
                        </li> :
                        null
                    }
                    <li role="presentation" className="flex-1">
                      <a id="tab-projects" href="#tab-projects-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-projects-content" role="tab" aria-controls="tab-projects-content" aria-selected="false">
                        <FaCubes className="text-xs sm:text-base inline mb-0.5 mx-2" />
                        <span className="hidden xs:inline">Projects</span>
                      </a>
                    </li>
                  </ul>
                  <div className="mb-4">
                    {/* Posts */}
                    <div id="tab-posts-content" className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="" data-te-tab-active>
                      <AddPost />
                      <GetPosts location={"my_profile"} />
                    </div>
                    {/* Services */}
                    {
                      authState.auth.user.role === "Developer" || authState.auth.user.role === "Delegate" ?
                        <div id="tab-services-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                          <AddService />
                          <GetServices location={"my_profile"} />
                        </div> :
                        null
                    }
                    {/* Projects */}
                    <div id="tab-projects-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                      {
                        authState.auth.user.role === "Developer" ?
                          <AddProject location={"my_profile"} /> :
                          null
                      }
                      <GetProjects location={"my_profile"} />
                    </div>
                  </div>
                </> :
                null
            }
          </> :
          authState.auth.user._id !== id && user?._id ?
            <>
              {/* Information */}
              <InformationProfile user={user} />
              {
                user.role !== "Admin" ?
                  <>
                    {/* Stories */}
                    <GetStories location={"target_profile"} target_id={user._id} />
                    {
                      user.role === "Delegate" ?
                        <>
                          {
                            user.company_id ?
                              <GetCompany companyId={user.company_id} /> :
                              <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-sm py-4 text-center rounded animation duration-1000 slide-in-up my-2">
                                <FaList className="inline mb-1 mr-2" />
                                No company found
                              </div>
                          }
                        </> :
                        null
                    }
                    <ul className="text-dark/50 dark:text-light/50 text-xs list-none flex flex-row flex-wrap gap-2" role="tablist" data-te-nav-ref>
                      <li role="presentation" className="flex-1">
                        <a id="tab-posts" href="#tab-posts-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-posts-content" role="tab" aria-controls="tab-posts-content" data-te-nav-active aria-selected="true">
                          <FaScroll className="text-xs sm:text-base inline mb-0.5 mx-2" />
                          <span className="hidden xs:inline">Posts</span>
                        </a>
                      </li>
                      {
                        user.role === "Developer" || user.role === "Delegate" ?
                          <li role="presentation" className="flex-1">
                            <a id="tab-services" href="#tab-services-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-services-content" role="tab" aria-controls="tab-services-content" aria-selected="false">
                              <FaBoxOpen className="text-xs sm:text-base inline mb-0.5 mx-2" />
                              <span className="hidden xs:inline">Services</span>
                            </a>
                          </li> :
                          null
                      }
                      <li role="presentation" className="flex-1">
                        <a id="tab-projects" href="#tab-projects-content" className="rounded transition-all duration-500 shadow-dark/10 dark:shadow-light/10 hover:opacity-75 bg-dark/[0.025] dark:bg-light/[0.025] shadow-inner data-[te-nav-active]:text-dark dark:data-[te-nav-active]:text-light data-[te-nav-active]:border-queen dark:data-[te-nav-active]:border-king border-dark/25 dark:border-light/25 border-b-[2.5px] py-1 flex justify-center items-center m-0" data-te-toggle="pill" data-te-target="#tab-projects-content" role="tab" aria-controls="tab-projects-content" aria-selected="false">
                          <FaCubes className="text-xs sm:text-base inline mb-0.5 mx-2" />
                          <span className="hidden xs:inline">Projects</span>
                        </a>
                      </li>
                    </ul>
                    <div className="mb-4">
                      {/* Posts */}
                      <div id="tab-posts-content" className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="" data-te-tab-active>
                        <GetPosts location={"target_profile"} target_id={user._id} />
                      </div>
                      {/* Services */}
                      {
                        user.role === "Developer" || user.role === "Delegate" ?
                          <div id="tab-services-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                            <GetServices location={"target_profile"} target_id={user._id} />
                          </div> :
                          null
                      }
                      {/* Projects */}
                      <div id="tab-projects-content" className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block" role="tabpanel" aria-labelledby="">
                        <GetProjects location={"target_profile"} target_id={user._id} />
                      </div>
                    </div>
                  </> :
                  null
              }
            </> :
            <span className='text-dark/75 dark:text-light/75'>Wait seconds or reload this page!</span>
      }
      {/* Modals */}
      {
        confirmModal(openSignOutModal, setOpenSignOutModal, "sign out", signOutSubmit, null)
      }
    </Container>
  )
}
export default Profile