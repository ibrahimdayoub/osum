import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addAdmin } from '../../../Redux/Features/Users/usersSlice';
import { FaCheckDouble, FaEye, FaEyeSlash, FaPlus, FaSpinner } from 'react-icons/fa'
import { toastify } from '../../../Helper';

const AddAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const usersState = useSelector((state) => state.users);
    const [adminInput, setAdminInput] = useState({
        first_name: "",
        last_name: "",
        address: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false)
    const handleUpdateInput = (e) => {
        e.persist();
        setAdminInput({ ...adminInput, [e.target.name]: e.target.value });
    };

    const UpdateSubmit = (e) => {
        e.preventDefault();
        const data = {
            first_name: adminInput.first_name,
            last_name: adminInput.last_name,
            address: adminInput.address,
            email: adminInput.email,
            password: adminInput.password,
        }
        dispatch(addAdmin({ data }))
    };
    useEffect(() => {
        if ((Date.now() - usersState.time < 100) && usersState.status === 201 && usersState.message && usersState.operation === "addAdmin") {
            toastify("success", usersState.status, usersState.message)
            setAdminInput({
                first_name: "",
                last_name: "",
                address: "",
                email: "",
                password: "",
            })
        }
        else if ((Date.now() - usersState.time < 100) && (usersState.status === 400 || usersState.status === 401 || usersState.status === 403) && usersState.message && usersState.operation === "addAdmin") {
            toastify("error", usersState.status, usersState.message)
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 404 && usersState.message && usersState.operation === "addAdmin") {
            toastify("error", usersState.status, usersState.message)
            setAdminInput({
                first_name: "",
                last_name: "",
                address: "",
                email: "",
                password: "",
            })
        }
        else if ((Date.now() - usersState.time < 100) && usersState.status === 500 && usersState.message && usersState.operation === "addAdmin") {
            toastify("warn", usersState.status, usersState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [usersState.status, usersState.message])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] my-2 p-4 rounded animation duration-1000 slide-in-up">
            <h2 className="text-dark dark:text-light text-base">
                <FaPlus className="inline text-lg mb-1 mr-1" />
                Add new admin:
            </h2>
            <form enctype="multipart/form-data" onSubmit={(e) => { UpdateSubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1 flex justify-between">
                        <div className="w-full mr-1">
                            <label htmlFor="first_name" className="sr-only">
                                First Name
                            </label>
                            <input
                                value={adminInput.first_name}
                                onChange={handleUpdateInput}
                                name="first_name"
                                type="text"
                                className={
                                    usersState.errors && usersState.errors.first_name && usersState.operation === "addAdmin" ?
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
                                value={adminInput.last_name}
                                onChange={handleUpdateInput}
                                name="last_name"
                                type="text"
                                className={
                                    usersState.errors && usersState.errors.last_name && usersState.operation === "addAdmin" ?
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
                            value={adminInput.address}
                            onChange={handleUpdateInput}
                            name="address"
                            type="text"
                            className={
                                usersState.errors && usersState.errors.address && usersState.operation === "addAdmin" ?
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
                            value={adminInput.email}
                            onChange={handleUpdateInput}
                            name="email"
                            type="email"
                            className={
                                usersState.errors && usersState.errors.email && usersState.operation === "addAdmin" ?
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
                                    value={adminInput.password}
                                    onChange={handleUpdateInput}
                                    name="password"
                                    type={!showPassword ? "password" : "text"}
                                    className={
                                        usersState.errors && usersState.errors.password && usersState.operation === "addAdmin" ?
                                            "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                            "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                                    }
                                    placeholder={usersState.errors && usersState.errors.password ? usersState.errors.password : "Password"}
                                />
                            </div>
                            <div
                                onClick={() => { setShowPassword(!showPassword) }}
                                className={
                                    usersState.errors && usersState.errors.password && usersState.operation === "addAdmin" ?
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
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            (usersState.isLoading && usersState.operation === "addAdmin") ? <FaSpinner className="text-sm animate-spin inline mr-1" /> :
                                <>
                                    <FaCheckDouble className="inline text-sm mr-1 mb-1" />
                                    Add Admin
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default AddAdmin