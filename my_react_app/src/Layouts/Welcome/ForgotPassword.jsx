import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLaptop, FaSpinner } from "react-icons/fa";
import { forgotPassword } from "../../Redux/Features/Auth/authSlice";
import AnimationShapes from "../../Components/Welcome/AnimationShapes";
import { toastify } from "../../Helper";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [forgotPasswordInput, setForgotPasswordInput] = useState({
    email: "",
    role: "",
  });
  const handleInput = (e) => {
    e.persist();
    setForgotPasswordInput({ ...forgotPasswordInput, [e.target.name]: e.target.value });
  };
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const data = {
      "email": forgotPasswordInput.email,
      "role": forgotPasswordInput.role,
    }
    dispatch(forgotPassword(data))
  };
  useEffect(() => {
    if (authState.auth && authState.auth.user.role) {
      toastify("warn", 403, "Location is locked by your role")
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
  }, [])
  useEffect(() => {
    if ((Date.now() - authState.time < 100) && authState.status === 200 && authState.message && authState.operation === "forgotPassword") {
      toastify("success", authState.status, authState.message)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 400 && authState.message && authState.operation === "forgotPassword") {
      toastify("error", authState.status, authState.message)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 404 && authState.message && authState.operation === "forgotPassword") {
      toastify("error", authState.status, authState.message)
      setForgotPasswordInput({
        email: "",
        role: ""
      })
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 500 && authState.message && authState.operation === "forgotPassword") {
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
              <FaLaptop className="inline text-queen/75 dark:text-king/75 text-2xl md:text-4xl" />
            </span> Forgot Password
          </h2>
        </div>
        <form onSubmit={(e) => { forgotPasswordSubmit(e) }}>
          <div>
            <div className="mb-1">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                value={forgotPasswordInput.email}
                onChange={handleInput}
                name="email"
                type="email"
                className={
                  authState.errors && authState.errors.email && authState.operation === "forgotPassword" ?
                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
                placeholder={authState.errors && authState.errors.email && authState.operation === "forgotPassword" ? authState.errors.email : "Email address"}
              />
            </div>
            <div className="mb-1">
              <select
                onChange={handleInput}
                name="role"
                value={forgotPasswordInput.role}
                className={
                  authState.errors && authState.errors.role && authState.operation === "forgotPassword" ?
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
              style={{ letterSpacing: 2 }}
            >
              {
                authState.isLoading ? <FaSpinner className="inline text-xl animate-spin" /> : "Forgot Password"
              }
            </button>
          </div>
        </form>
      </div>
      <AnimationShapes />
    </div>
  );
};
export default ForgotPassword;