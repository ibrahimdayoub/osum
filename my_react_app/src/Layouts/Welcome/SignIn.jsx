import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLaptopCode,FaEye, FaEyeSlash, FaSpinner} from "react-icons/fa";
import { reset, signIn } from "../../Redux/Features/Auth/authSlice";
import AnimationShapes from "../../Components/Welcome/AnimationShapes";
import { toastify } from "../../Helper";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);
  const [showPassword,setShowPassword]=useState(false)
  const [signInInput,setSignInInput]=useState({
    email:"",
    password:"",
    role:""
  });
  const handleInput=(e)=>{
    e.persist();
    setSignInInput({...signInInput,[e.target.name]:e.target.value});
  };
  const signInSubmit= (e)=>{
    e.preventDefault();
    const data={
      "email":signInInput.email,
      "password":signInInput.password,
      "role":signInInput.role,
    }
    dispatch(signIn(data))
  };
  useEffect(() => {
    if(authState.auth && authState.auth.user.role)
    {
      toastify("warn", 403, "Location is locked by your role")
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
    else if(authState.status === 200 && authState.message && authState.operation === "signOut")
    {
      toastify("success", authState.status, authState.message)
      dispatch(reset())
    }
  },[])
  useEffect(() => {
    if ((Date.now() - authState.time < 100) && authState.status === 200 && authState.message && authState.operation === "signIn")
    {
      toastify("success", authState.status, authState.message)
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
    else if ((Date.now() - authState.time < 100) && (authState.status === 400 || authState.status === 401) && authState.message && authState.operation === "signIn")
    {
      toastify("error", authState.status, authState.message)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 404 && authState.message && authState.operation === "signIn")
    {
      toastify("error", authState.status, authState.message)
      setSignInInput({
        email:"",
        password:"",
        role:""
      })
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 500 && authState.message && authState.operation === "signIn")
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
              <FaLaptopCode className="inline text-queen/75 dark:text-king/75 text-2xl md:text-4xl"/>
            </span> Sign In 
          </h2>
        </div>
        <form onSubmit={(e) => {signInSubmit(e)}}>
          <div>
            <div className="mb-1">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                value={signInInput.email}
                onChange={handleInput}
                name="email"
                type="email"
                className={
                  authState.errors&&authState.errors.email&&authState.operation === "signIn"?
                  "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                  "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
                placeholder={authState.errors&&authState.errors.email&&authState.operation === "signIn"?authState.errors.email:"Email address"}
              />
            </div>
            <div className="mb-1">
              <div className="flex relative">
                  <div className="w-full">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      value={signInInput.password}
                      onChange={handleInput}
                      name="password"
                      type={!showPassword?"password":"text"}
                      className={
                        authState.errors&&authState.errors.password&&authState.operation === "signIn"?
                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                      }
                      placeholder={authState.errors&&authState.errors.password&&authState.operation === "signIn"?authState.errors.password:"Password"}
                    />
                  </div>
                  <div
                    onClick={()=>{setShowPassword(!showPassword)}}
                    className={
                        authState.errors&&authState.errors.password&&authState.operation === "signIn"?
                        "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-1 cursor-pointer w-10 p-1 z-10" :
                        "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-1 cursor-pointer w-10 p-1 z-10"
                    }
                  >
                    {
                      !showPassword?
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
              value={signInInput.role}
              className={
                authState.errors&&authState.errors.role&&authState.operation === "signIn"?
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
              to="/forgot-password"
              className="text-queen dark:text-king hover:opacity-75 text-sm ml-1"
            >
              Forgot password?
            </Link>
            <Link
              to="/sign-up"
              className="text-queen dark:text-king hover:opacity-75 text-sm mr-1"
            >
              Don't have an account?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-2 transition-all duration-500 cursor-pointer text-sm px-4 rounded-md"
              style={{letterSpacing:2}}
            >
            {
              authState.isLoading ? <FaSpinner className="inline text-xl animate-spin"/> : "Sign In"
            }
            </button>
          </div>
        </form>
      </div>
      <AnimationShapes/>
    </div>
  );
};
export default SignIn;