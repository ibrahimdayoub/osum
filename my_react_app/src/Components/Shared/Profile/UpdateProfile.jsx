import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { set } from "../../../Redux/Features/Auth/authSlice";
import { updateUser } from '../../../Redux/Features/Users/usersSlice';
import { FaEdit, FaEye, FaEyeSlash, FaFileImage, FaSave, FaSpinner } from 'react-icons/fa'
import { toastify } from '../../../Helper';

const UpdateProfile = ({ user }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const usersState = useSelector((state) => state.users);
    const [UpdateInput, setUpdateInput] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        email: user.email,
        github_link: user.github_link ? user.github_link : "",
        password: "",
        role: user.role,
        field_of_work: user.field_of_work ? user.field_of_work : "",
        picture_personal_profile: "",
    });
    const [picturePersonalProfile, setPicturePersonalProfile] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const handleUpdateInput = (e) => {
        e.persist();
        setUpdateInput({ ...UpdateInput, [e.target.name]: e.target.value });
    };
    const handlePicturePersonalProfile = (e) => {
        const file = e.target.files[0];
        setPicturePersonalProfile(file);
    }
    const UpdateSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("first_name", UpdateInput.first_name);
        formData.append("last_name", UpdateInput.last_name);
        formData.append("address", UpdateInput.address);
        formData.append("email", UpdateInput.email);
        formData.append("github_link", UpdateInput.github_link);
        formData.append("password", UpdateInput.password);
        formData.append("role", UpdateInput.role);
        formData.append("field_of_work", UpdateInput.field_of_work);
        formData.append("picture_personal_profile", picturePersonalProfile);

        dispatch(updateUser({ id: user._id, data: formData }))
    };
    useEffect(() => {
        if ((Date.now() - usersState.time < 100) && usersState.status === 200 && usersState.message && usersState.operation === "updateUser") {
            toastify("success", usersState.status, usersState.message)
            const users = (usersState.users).filter(user => {
                return user._id === authState.auth.user._id
            })
            dispatch(set({
                user: users[0],
                operation: "updateUser"
            }))
        }
        else if ((Date.now() - usersState.time < 100) && (usersState.status === 400 || usersState.status === 401 || usersState.status === 403) && usersState.message && usersState.operation === "updateUser") {
            toastify("error", usersState.status, usersState.message)
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 404 && usersState.message && usersState.operation === "updateUser") {
            toastify("error", usersState.status, usersState.message)
            setUpdateInput({
                first_name: "",
                last_name: "",
                address: "",
                email: "",
                github_link: "",
                password: "",
                role: "",
                field_of_work: "",
                picture_personal_profile: "",
            })
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 500 && usersState.message && usersState.operation === "updateUser") {
            toastify("warn", usersState.status, usersState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [usersState.status, usersState.message])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] my-2 p-4 rounded animation duration-1000 slide-in-up">
            <h2 className="text-dark dark:text-light text-base">
                <FaEdit className="inline text-lg mb-1 mr-1" />
                Update your profile:
            </h2>
            <form enctype="multipart/form-data" onSubmit={(e) => { UpdateSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1 flex justify-between">
                        <div className="w-full mr-1">
                            <label htmlFor="first_name" className="sr-only">
                                First Name
                            </label>
                            <input
                                value={UpdateInput.first_name}
                                onChange={handleUpdateInput}
                                name="first_name"
                                type="text"
                                className={
                                    usersState.errors && usersState.errors.first_name && usersState.operation === "updateUser" ?
                                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                }
                                placeholder={usersState.errors && usersState.errors.first_name && usersState.operation ? usersState.errors.first_name : "First Name"}
                            />
                        </div>
                        <div className="w-full ml-1">
                            <label htmlFor="last_name" className="sr-only">
                                Last Name
                            </label>
                            <input
                                value={UpdateInput.last_name}
                                onChange={handleUpdateInput}
                                name="last_name"
                                type="text"
                                className={
                                    usersState.errors && usersState.errors.last_name && usersState.operation === "updateUser" ?
                                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                }
                                placeholder={usersState.errors && usersState.errors.last_name ? usersState.errors.last_name : "Last Name"}
                            />
                        </div>
                    </div>
                    <div className="mb-1">
                        <label htmlFor="address" className="sr-only">
                            Address
                        </label>
                        <input
                            value={UpdateInput.address}
                            onChange={handleUpdateInput}
                            name="address"
                            type="text"
                            className={
                                usersState.errors && usersState.errors.address && usersState.operation === "updateUser" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={usersState.errors && usersState.errors.address ? usersState.errors.address : "Address"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            value={UpdateInput.email}
                            onChange={handleUpdateInput}
                            name="email"
                            type="email"
                            className={
                                usersState.errors && usersState.errors.email && usersState.operation === "updateUser" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={usersState.errors && usersState.errors.email ? usersState.errors.email : "Email address"}
                        />
                    </div>
                    <div className="mb-1">
                        <div className="flex relative">
                            <div className="w-full">
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    onChange={handleUpdateInput}
                                    name="password"
                                    type={!showPassword ? "password" : "text"}
                                    className={
                                        usersState.errors && usersState.errors.password && usersState.operation === "updateUser" ?
                                            "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                            "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                    }
                                    placeholder={usersState.errors && usersState.errors.password ? usersState.errors.password : "Password"}
                                />
                            </div>
                            <div
                                onClick={() => { setShowPassword(!showPassword) }}
                                className={
                                    usersState.errors && usersState.errors.password && usersState.operation === "updateUser" ?
                                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-0 cursor-pointer w-10 p-1 z-10" :
                                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-0 cursor-pointer w-10 p-1 z-10"
                                }
                            >
                                {
                                    !showPassword ?
                                        <FaEye className="text-lg " /> :
                                        <FaEyeSlash className="text-lg" />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="mb-1">
                        <select
                            className="placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                        >
                            <option value="">{UpdateInput.role}</option>
                        </select>
                    </div>
                    {
                        UpdateInput.role === "Developer" || UpdateInput.role === "Delegate" ?
                            <div className="mb-1">
                                <label htmlFor="github_link" className="sr-only">
                                    Github link
                                </label>
                                <input
                                    value={UpdateInput.github_link}
                                    onChange={handleUpdateInput}
                                    name="github_link"
                                    type="text"
                                    className={
                                        usersState.errors && usersState.errors.github_link && usersState.operation === "updateUser" ?
                                            "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                            "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                    }
                                    placeholder={usersState.errors && usersState.errors.github_link ? usersState.errors.github_link : "Github link"}
                                />
                            </div> :
                            null
                    }
                    {
                        UpdateInput.role !== "Admin" ?
                            <div className="mb-1">
                                <select
                                    onChange={handleUpdateInput}
                                    name="field_of_work"
                                    defaultValue={UpdateInput.field_of_work}
                                    className={
                                        usersState.errors && usersState.errors.field_of_work && usersState.operation === "updateUser" ?
                                            "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                            "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                    }
                                >
                                    <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Select field of work</option>
                                    <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" > Programming</option>
                                    <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" >Designing</option>
                                    <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" >Content Writing</option>
                                    <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" >Translation</option>
                                </select>
                            </div> :
                            null
                    }
                    <div className="mb-1">
                        <label htmlFor="picture_personal_profile"
                            className={
                                usersState.errors && usersState.errors.picture_personal_profile && usersState.operation === "updateUser" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                        >
                            {
                                usersState.errors && usersState.errors.picture_personal_profile && usersState.operation === "updateUser" ?
                                    usersState.errors.picture_personal_profile :
                                    picturePersonalProfile && picturePersonalProfile.name ?
                                        <span className="text-dark dark:text-light">{picturePersonalProfile.name}</span> :
                                        "Picture personal profile "
                            }
                            <div
                                className={
                                    usersState.errors && usersState.errors.picture_personal_profile && usersState.operation === "updateUser" ?
                                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-0 cursor-pointer w-10 p-1 z-10" :
                                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-0 cursor-pointer w-10 p-1 z-10"
                                }
                            >
                                <FaFileImage className="text-base" />
                            </div>
                        </label>
                        <input
                            onChange={handlePicturePersonalProfile}
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            hidden={true}
                            id="picture_personal_profile"
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (usersState.isLoading && usersState.operation === "updateUser") ? <FaSpinner className="text-sm animate-spin inline mr-1" /> :
                                <>
                                    <FaSave className="inline text-sm mr-1 mb-1" />
                                    Save Changes
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default UpdateProfile