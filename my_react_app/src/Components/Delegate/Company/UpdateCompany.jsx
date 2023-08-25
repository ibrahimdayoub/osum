import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"
import { updateCompany } from "../../../Redux/Features/Companies/companiesSlice";
import { FaCity, FaEdit, FaSpinner } from "react-icons/fa"
import { toastify } from "../../../Helper";

const UpdateCompany = ({ company, setCompany, setOpenUpdate }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const companiesState = useSelector((state) => state.companies)
    const [companyInput, setCompanyInput] = useState({
        company_name: company.company_name,
        company_description: company.company_description,
        location: company.location,
        field_of_work: company.field_of_work
    });
    const [openUpdateAlt, setOpenUpdateAlt] = useState(false)
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
        dispatch(updateCompany({ id: company._id, data }))
        setOpenUpdateAlt(true)
    }
    useEffect(() => {
        if ((Date.now() - companiesState.time < 100) && companiesState.status === 200 && companiesState.message && companiesState.operation === "updateCompany") {
            toastify("success", companiesState.status, companiesState.message)
            if (openUpdateAlt) {
                setOpenUpdate(false)
            }
            setCompany(
                (companiesState.companies.filter((company_) => {
                    return company_._id === company._id
                }))[0]
            )
        }
        else if ((Date.now() - companiesState.time < 100) && (companiesState.status === 400 || companiesState.status === 401 || companiesState.status === 403 || companiesState.status === 404) && companiesState.message && companiesState.operation === "updateCompany") {
            toastify("error", companiesState.status, companiesState.message)
        }
        else if ((Date.now() - companiesState.time < 100) && companiesState.status === 500 && companiesState.message && companiesState.operation === "updateCompany") {
            toastify("warn", companiesState.status, companiesState.message)
            setTimeout(() => {
                navigate(0)
            }, 5000);
        }
    }, [companiesState.status, companiesState.message, companiesState.errors])
    return (
        <div className="bg-dark/[0.025] dark:bg-light/[0.025] p-2 mt-2 mb-2 rounded-md max-w-5xl mx-auto">
            <h2 className="text-dark dark:text-light text-base">
                <FaCity className="inline text-lg mr-2" />
                Update your company and work with all:
            </h2>
            <form onSubmit={(e) => { companySubmit(e) }}>
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
                                companiesState.errors && companiesState.errors.company_name && companiesState.operation === "updateCompany" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={companiesState.errors && companiesState.errors.company_name && companiesState.operation === "updateCompany" ? companiesState.errors.company_name : "What its name ?"}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="company_description" className="sr-only">
                            Company Description
                        </label>
                        <input
                            value={companyInput.company_description}
                            onChange={handleInput}
                            name="company_description"
                            className={
                                companiesState.errors && companiesState.errors.company_description && companiesState.operation === "updateCompany" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={companiesState.errors && companiesState.errors.company_description && companiesState.operation === "updateCompany" ? companiesState.errors.company_description : "Company Description"}
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
                                companiesState.errors && companiesState.errors.location && companiesState.operation === "updateCompany" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                            placeholder={companiesState.errors && companiesState.errors.location && companiesState.operation === "updateCompany" ? companiesState.errors.location : "Company Location"}
                        />
                    </div>
                    <div className="mb-1">
                        <select
                            onChange={handleInput}
                            value={companyInput.field_of_work}
                            name="field_of_work"
                            className={
                                companiesState.errors && companiesState.errors.field_of_work && companiesState.operation === "updateCompany" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger/50 dark:text-danger/50 bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none px-2 focus:z-10 focus:outline-none sm:text-xs"
                            }
                        >
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Field of work</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Programming</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Designing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Content Writing</option>
                            <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Translation</option>
                        </select>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button type="submit" className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 py-1 transition-all duration-500 cursor-pointer text-xs rounded-md min-w-[150px]">
                        {
                            companiesState.isLoading && companiesState.operation === "updateCompany" ? <FaSpinner className="inline text-xs mr-1 mb-0.5" /> :
                                <>
                                    <FaEdit className="inline text-xs mr-1 mb-0.5" />
                                    Update
                                </>
                        }
                    </button>
                </div>
            </form>
        </div>
    )
}
export default UpdateCompany