import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaKeyboard,FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { resetPassword } from "../../Redux/Features/Auth/authSlice";
import AnimationShapes from "../../Components/Welcome/AnimationShapes";
import { toastify } from "../../Helper";

const ResetPassword = () => {
  const {id} = useParams()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);
  const [showNewPassword,setShowNewPassword]=useState(false)  
  const [showConfirmPassword,setShowConfirmPassword]=useState(false)
  const [resetPasswordInput,setResetPasswordInput]=useState({
    email:"",
    new_password:"",
    confirm_password:"",
    role:""
  });
  const handleInput=(e)=>{
    e.persist();
    setResetPasswordInput({...resetPasswordInput,[e.target.name]:e.target.value});
  };
  const resetPasswordSubmit= (e)=>{
    e.preventDefault();
    const data={
      "code":id,
      "email":resetPasswordInput.email,
      "new_password":resetPasswordInput.new_password,
      "confirm_password":resetPasswordInput.confirm_password,
      "role":resetPasswordInput.role,
    }
    
    dispatch(resetPassword(data))
  };
  useEffect(() => {
    if(authState.auth && authState.auth.user.role)
    {
      toastify("warn", 403, "Location is locked by your role")
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
  },[])
  useEffect(() => {
    if ((Date.now() - authState.time < 100) && authState.status === 200 && authState.message && authState.operation === "resetPassword")
    {
      toastify("success", authState.status, authState.message)
      navigate("/sign-in")
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 400 && authState.message && authState.operation === "resetPassword")
    {
      toastify("error", authState.status, authState.message)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 404 && authState.message && authState.operation === "resetPassword")
    {
      toastify("error", authState.status, authState.message)
      setResetPasswordInput({
        email:"",
        new_password:"",
        confirm_password:"",
        role:""
      })
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 500 && authState.message && authState.operation === "resetPassword")
    {
      toastify("warn", authState.status, authState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }
  }, [authState.status, authState.message, authState.errors])
  return (
    <div className="max-h-screen overflow-y-auto mx-auto py-6 px-10 md:px-20 xl:px-28">
      <div className="bg-dark/[0.05] dark:bg-light/[0.05] max-w-md mx-auto px-2 py-6 mt-8 rounded-md">
        <div className="mb-2">
          <h2 className="text-dark dark:text-light text-center text-2xl md:text-3xl font-bold tracking-tight">
            <span>
              <FaKeyboard className="inline text-queen/75 dark:text-king/75 text-2xl md:text-4xl"/>
            </span> Reset password
          </h2>
        </div>
        <form onSubmit={(e) => {resetPasswordSubmit(e)}}>
          <div>
            <div className="mb-1">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                value={resetPasswordInput.email}
                onChange={handleInput}
                name="email"
                type="email"
                className={
                  authState.errors&&authState.errors.email&&authState.operation === "resetPassword"?
                  "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                  "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
                placeholder={authState.errors&&authState.errors.email&&authState.operation === "resetPassword"?authState.errors.email:"Email address"}
              />
            </div>
            <div className="mb-1">
              <div className="flex relative">
                  <div className="w-full">
                    <label htmlFor="new_password" className="sr-only">
                      New password
                    </label>
                    <input
                      value={resetPasswordInput.new_password}
                      onChange={handleInput}
                      name="new_password"
                      type={!showNewPassword?"password":"text"}
                      className={
                        authState.errors&&authState.errors.new_password&&authState.operation === "resetPassword"?
                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                      }
                      placeholder={authState.errors&&authState.errors.new_password&&authState.operation === "resetPassword"?authState.errors.new_password:"New password"}
                    />
                  </div>
                  <div
                    onClick={()=>{setShowNewPassword(!showNewPassword)}}
                    className={
                        authState.errors&&authState.errors.new_password&&authState.operation === "resetPassword"?
                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-1 cursor-pointer w-10 p-1 z-10" :
                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-1 cursor-pointer w-10 p-1 z-10"
                    }
                  >
                    {
                      !showNewPassword?
                      <FaEye className="text-xl"/>:
                      <FaEyeSlash className="text-xl"/>
                    }
                  </div>
              </div>
            </div>
            <div className="mb-1">
              <div className="flex relative">
                  <div className="w-full">
                    <label htmlFor="confirm_password" className="sr-only">
                      Confirm password
                    </label>
                    <input
                      value={resetPasswordInput.confirm_password}
                      onChange={handleInput}
                      name="confirm_password"
                      type={!showConfirmPassword?"password":"text"}
                      className={
                        authState.errors&&authState.errors.confirm_password&&authState.operation === "resetPassword"?
                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                      }
                      placeholder={authState.errors&&authState.errors.confirm_password&&authState.operation === "resetPassword"?authState.errors.confirm_password:"Confirm password"}
                    />
                  </div>
                  <div
                    onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}
                    className={
                        authState.errors&&authState.errors.confirm_password&&authState.operation === "resetPassword"?
                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-1 cursor-pointer w-10 p-1 z-10" :
                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-1 cursor-pointer w-10 p-1 z-10"
                    }
                  >
                    {
                      !showConfirmPassword?
                      <FaEye className="text-xl"/>:
                      <FaEyeSlash className="text-xl"/>
                    }
                  </div>
              </div>
            </div>
            <div>
              <select 
              onChange={handleInput}
              name="role" 
              value={resetPasswordInput.role}
              className={
                authState.errors&&authState.errors.role&&authState.operation === "resetPassword"?
                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
              }
              >
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Select role</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Client</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Developer</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Delegate</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between my-4">
            <Link
              to="/sign-in"
              className="text-queen dark:text-king hover:opacity-75 text-sm ml-1"
            >
              Remembered password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-2 transition-all duration-500 cursor-pointer text-sm px-4 rounded-md"
              style={{letterSpacing:2}}
            >
            {
              authState.isLoading ? <FaSpinner className="inline text-xl animate-spin"/> : "Reset Password"
            }
            </button>
          </div>
        </form>
      </div>
      <AnimationShapes/>
    </div>
  );
};
export default ResetPassword;