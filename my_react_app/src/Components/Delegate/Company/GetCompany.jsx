import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { set } from "../../../Redux/Features/Auth/authSlice";
import { deleteCompany, getCompany, likeCompany } from "../../../Redux/Features/Companies/companiesSlice";
import { FaCity, FaEdit, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa"
import UpdateCompany from "./UpdateCompany";
import { toastify } from "../../../Helper";

const GetCompany = ({ companyId }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const socketState = useSelector((state) => state.socket);
    const companiesState = useSelector((state) => state.companies);
    const [company, setCompany] = useState({})
    const [openUpdate, setOpenUpdate] = useState(false)
    const [currentLikedCompanyId, setCurrrentLikedCompanyId] = useState('')
    const deleteCompanySubmit = () => {
        dispatch(deleteCompany({ id: companyId }))
    }
    const likeCompanySubmit = () => {
        setCurrrentLikedCompanyId(companyId)
        dispatch(likeCompany({ id: companyId }))
    }
    useEffect(() => {
        dispatch(getCompany({ id: companyId }))
    }, [])
    useEffect(() => {
        if ((Date.now() - companiesState.time < 100) && companiesState.status === 200 && companiesState.message && companiesState.operation === "getCompany") {
            toastify("success", companiesState.status, companiesState.message)
            setCompany(
                (companiesState.companies.filter((company) => {
                    return company._id === companyId
                }))[0]
            )
        }
        else if ((Date.now() - companiesState.time < 100) && (companiesState.status === 400 || companiesState.status === 401 || companiesState.status === 403) && companiesState.message && companiesState.operation === "getCompany") {
            toastify("error", companiesState.status, companiesState.message)
        }
        else if ((Date.now() - companiesState.time < 100) && companiesState.status === 500 && companiesState.message && companiesState.operation === "getCompany") {
            toastify("warn", companiesState.status, companiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - companiesState.time < 100) && companiesState.status === 200 && companiesState.message && companiesState.operation === "deleteCompany") {
            toastify("success", companiesState.status, companiesState.message)
            dispatch(set({
                user: { ...authState.auth.user, company_id: null },
                operation: "updateUser"
            }))
        }
        else if ((Date.now() - companiesState.time < 100) && (companiesState.status === 401 || companiesState.status === 403 || companiesState.status === 404) && companiesState.message && companiesState.operation === "deleteCompany") {
            toastify("error", companiesState.status, companiesState.message)
        }
        else if ((Date.now() - companiesState.time < 100) && companiesState.status === 500 && companiesState.message && companiesState.operation === "deleteCompany") {
            toastify("warn", companiesState.status, companiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }

        if ((Date.now() - companiesState.time < 100) && companiesState.status === 200 && companiesState.message && companiesState.operation === "likeCompany") {
            toastify("success", companiesState.status, companiesState.message)
            setCompany(
                (companiesState.companies.filter((company) => {
                    return company._id === companyId
                }))[0]
            )
            const currentLikedCompany = companiesState.companies.filter((company) => {
                return company._id === currentLikedCompanyId
            })[0]
            if (currentLikedCompany.likes.includes(authState.auth.user._id)) {
                //Add Notification (When Like Company By Client, Developer or Delegate)
                socketState.socket.emit("addNotification", {
                    receiversIds: [currentLikedCompany.delegate_id._id],
                    redirect: `profile/${currentLikedCompany.delegate_id._id}`,
                    message: `There is a ${authState.auth.user.role} likes your company, go to your profile and check it`,
                })
            }
        }
        else if ((Date.now() - companiesState.time < 100) && (companiesState.status === 401 || companiesState.status === 403 || companiesState.status === 404) && companiesState.message && companiesState.operation === "likeCompany") {
            toastify("error", companiesState.status, companiesState.message)
        }
        else if ((Date.now() - companiesState.time < 100) && companiesState.status === 500 && companiesState.message && companiesState.operation === "likeCompany") {
            toastify("warn", companiesState.status, companiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [companiesState.status, companiesState.message, companiesState.errors])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] px-4 py-2 my-2 text-sm " >
            <h2 className="text-lg text-dark dark:text-light mb-2 border-b border-dark/50 dark:border-light/50 w-fit">
                <FaCity className="inline text-xl mb-1 mr-2" />
                Company Info:
            </h2>
            <div className=" max-w-5xl mx-auto">
                <p className="ml-1">
                    <span className=" text-dark dark:text-light mr-1">Name:</span>
                    <span className="text-dark/50 dark:text-light/50">{company?.company_name}</span>
                </p>
                <p className="ml-1">
                    <span className=" text-dark dark:text-light mr-1">Description:</span>
                    <span className="text-dark/50 dark:text-light/50">{company?.company_description}</span>
                </p>
                <p className="ml-1">
                    <span className=" text-dark dark:text-light mr-1">Location:</span>
                    <span className="text-dark/50 dark:text-light/50">{company?.location}</span>
                </p>
                <p className="ml-1">
                    <span className=" text-dark dark:text-light mr-1">Work Field:</span>
                    <span className="text-dark/50 dark:text-light/50">{company?.field_of_work}</span>
                </p>
                <div className={
                    company?.delegate_id === authState.auth.user._id ?
                        "flex flex-wrap justify-between items-center gap-2" :
                        "flex flex-wrap justify-end items-center gap-2"
                }
                >
                    <button onClick={() => { likeCompanySubmit() }} title="like" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                        {company?.likes?.length}
                        {
                            company?.likes?.includes(authState.auth.user._id) ?
                                <FaHeart className="inline text-base ml-1" /> :
                                <FaRegHeart className="inline text-base ml-1" />
                        }
                    </button>
                    {
                        company?.delegate_id === authState.auth.user._id ?
                            <div>
                                <button onClick={() => { setOpenUpdate(!openUpdate) }} title="Edit" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                    <FaEdit className="text-base" />
                                </button>
                                <button onClick={() => { deleteCompanySubmit() }} title="Delete" className="text-queen dark:text-king hover:text-queen/75 dark:hover:text-king/75 transition-all duration-300 mr-1">
                                    <FaTrash className="text-base" />
                                </button>
                            </div> :
                            null
                    }
                </div>
            </div>
            {
                openUpdate ?
                    <UpdateCompany company={company} setCompany={setCompany} setOpenUpdate={setOpenUpdate} /> :
                    null
            }
        </div >
    )
}
export default GetCompany