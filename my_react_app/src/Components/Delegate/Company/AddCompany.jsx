import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { set } from "../../../Redux/Features/Auth/authSlice";
import { addCompany } from "../../../Redux/Features/Companies/companiesSlice";
import { FaCity, FaCodeBranch, FaSpinner } from "react-icons/fa"
import { toastify } from "../../../Helper";

const AddCompany = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.auth);
    const companiesState = useSelector((state) => state.companies)
    const [companyInput, setCompanyInput] = useState({
        company_name: "",
        company_description: "",
        location: "",
        field_of_work: ""
    });
    const toastOptions = {
        position: "top-right",
        autoClose: 2500,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    };
    const handleInput = (e) => {
        e.persist();
        setCompanyInput({ ...companyInput, [e.target.name]: e.target.value });
    };
    const companySubmit = (e) => {
        e.preventDefault();
        const data = {
            company_name: companyInput.company_name,
            company_description: companyInput.company_description,
            location: companyInput.location,
            field_of_work: companyInput.field_of_work
        }
        dispatch(addCompany({ data }))
    }
    useEffect(() => {
        if ((Date.now() - companiesState.time < 100) && companiesState.status === 201 && companiesState.message && companiesState.operation === "addCompany") {
            toastify("success", companiesState.status, companiesState.message)
            setCompanyInput({
                company_name: "",
                company_description: "",
                location: "",
                field_of_work: ""
            });
            dispatch(set({
                user: { ...authState.auth.user, company_id: companiesState.companies[0]._id },
                operation: "updateUser"
            }))
        }
        else if ((Date.now() - companiesState.time < 100) && (companiesState.status === 400 || companiesState.status === 401 || companiesState.status === 403) && companiesState.message && companiesState.operation === "addCompany") {
            toastify("error", companiesState.status, companiesState.message)
        }
        else if ((Date.now() - companiesState.time < 100) && companiesState.status === 500 && companiesState.message && companiesState.operation === "addCompany") {
            toastify("warn", companiesState.status, companiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [companiesState.status, companiesState.message, companiesState.errors])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] p-4 mt-2 mb-2 rounded-md">
            <h2 className="text-dark dark:text-light text-base">
                <FaCity className="inline text-lg mr-2" />
                Add your company and work with all:
            </h2>
            <form onSubmit={(e) => { companySubmit(e) }} className="max-w-5xl mx-auto">
                <div className="my-2">
                    <div className="mb-1">
                        <label htmlFor="company_name" className="sr-only">
                            Company Name
                        </label>
                        <input
                            value={companyInput.company_name}
                            onChange={handleInput}
                            name="company_name"
                            className={
                                companiesState.errors && companiesState.errors.company_name && companiesState.operation === "addCompany" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                            }
                            placeholder={companiesState.errors && companiesState.errors.company_name && companiesState.operation === "addCompany" ? companiesState.errors.company_name : "What its name ?"}
                        />
                    </div>
                    {
                        companyInput.company_name || companyInput.company_description || companyInput.location || companyInput.field_of_work ?
                            <>
                                <div className="mb-1">
                                    <label htmlFor="company_description" className="sr-only">
                                        Company Description
                                    </label>
                                    <input
                                        value={companyInput.company_description}
                                        onChange={handleInput}
                                        name="company_description"
                                        className={
                                            companiesState.errors && companiesState.errors.company_description && companiesState.operation === "addCompany" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                                        }
                                        placeholder={companiesState.errors && companiesState.errors.company_description && companiesState.operation === "addCompany" ? companiesState.errors.company_description : "Company Description"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <label htmlFor="location" className="sr-only">
                                        Company Location
                                    </label>
                                    <input
                                        value={companyInput.location}
                                        onChange={handleInput}
                                        name="location"
                                        className={
                                            companiesState.errors && companiesState.errors.location && companiesState.operation === "addCompany" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                                        }
                                        placeholder={companiesState.errors && companiesState.errors.location && companiesState.operation === "addCompany" ? companiesState.errors.location : "Company Location"}
                                    />
                                </div>
                                <div className="mb-1">
                                    <select
                                        onChange={handleInput}
                                        value={companyInput.field_of_work}
                                        name="field_of_work"
                                        className={
                                            companiesState.errors && companiesState.errors.field_of_work && companiesState.operation === "addCompany" ?
                                                "placeholder-danger/50 dark:placeholder-danger/50 text-danger/50 dark:text-danger/50 bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm" :
                                                "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-sm"
                                        }
                                    >
                                        <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Field of work</option>
                                        <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Programming</option>
                                        <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Designing</option>
                                        <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Content Writing</option>
                                        <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Translation</option>
                                    </select>
                                </div>
                            </> :
                            null
                    }
                </div>
                {
                    companyInput.company_name || companyInput.company_description || companyInput.location || companyInput.field_of_work ?
                        <div className='flex justify-end'>
                            <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                                {
                                    companiesState.isLoading && companiesState.operation === "addCompany" ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                        <>
                                            <FaCodeBranch className="inline text-xs mr-1 mb-0.5" />
                                            Link
                                        </>
                                }
                            </button>
                        </div> :
                        null
                }
            </form>
        </div>
    )
}
export default AddCompany