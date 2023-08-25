import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLaptopMedical,FaEye, FaEyeSlash, FaSpinner,FaFileImage} from "react-icons/fa";
import { signUp } from "../../Redux/Features/Auth/authSlice";
import AnimationShapes from "../../Components/Welcome/AnimationShapes";
import { toastify } from "../../Helper";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state)=>state.auth);
  const [showPassword,setShowPassword]=useState(false)
  const [signUpInput,setSignUpInput]=useState({
    first_name:"",
    last_name:"",
    address:"",
    email:"",
    github_link:"",
    password:"",
    role:"",
    field_of_work:"",
  });
  const [picturePersonalProfile, setPicturePersonalProfile] = useState("");//
  const handleInput=(e)=>{
    e.persist();
    setSignUpInput({...signUpInput,[e.target.name]:e.target.value});
  };
  const handlePicturePersonalProfule=(e)=>{
    const file = e.target.files[0];
    setPicturePersonalProfile(file);
  }
  const signUpSubmit= (e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", signUpInput.first_name);
    formData.append("last_name", signUpInput.last_name);
    formData.append("address", signUpInput.address);
    formData.append("email", signUpInput.email);
    formData.append("github_link", signUpInput.github_link);
    formData.append("password", signUpInput.password);
    formData.append("role", signUpInput.role);
    formData.append("field_of_work", signUpInput.field_of_work);
    formData.append("picture_personal_profile", picturePersonalProfile);
    dispatch(signUp(formData))
  };
  useEffect(() => {
    if(authState.auth && authState.auth.user.role)
    {
      toastify("warn", 403, "Location is locked by your role")
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
  },[])
  useEffect(() => {
    if ((Date.now() - authState.time < 100) && authState.status === 201 && authState.message && authState.operation === "signUp")
    {
      toastify("success", authState.status, authState.message)
      navigate(`/${(authState.auth.user.role).toLowerCase()}`)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 400 && authState.message && authState.operation === "signUp")
    {
      toastify("error", authState.status, authState.message)
    }
    else if ((Date.now() - authState.time < 100) && authState.status === 500 && authState.message && authState.operation === "signUp") 
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
              <FaLaptopMedical className="inline text-queen/75 dark:text-king/75 text-2xl md:text-4xl"/>
            </span> Sign Up
          </h2>
        </div>
        <form enctype="multipart/form-data" onSubmit={(e) => {signUpSubmit(e)}}>
          <div>
            <div className="mb-1 flex justify-between">
              <div className="w-full mr-1">
                <label htmlFor="first_name" className="sr-only">
                  First Name
                </label>
                <input
                  value={signUpInput.first_name}
                  onChange={handleInput}
                  name="first_name"
                  type="text"
                  className={
                    authState.errors&&authState.errors.first_name&&authState.operation === "signUp"?
                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                  }
                  placeholder={authState.errors&&authState.errors.first_name&&authState.operation === "signUp"?authState.errors.first_name:"First Name"}
                />
              </div>

              <div className="w-full ml-1">
                <label htmlFor="last_name" className="sr-only">
                  Last Name
                </label>
                <input
                  value={signUpInput.last_name}
                  onChange={handleInput}
                  name="last_name"
                  type="text"
                  className={
                    authState.errors&&authState.errors.last_name&&authState.operation === "signUp"?
                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                  }
                  placeholder={authState.errors&&authState.errors.last_name&&authState.operation === "signUp"?authState.errors.last_name:"Last Name"}
                />
              </div>
            </div>
            <div className="mb-1">
              <label htmlFor="address" className="sr-only">
                Address
              </label>
              <input
                value={signUpInput.address}
                onChange={handleInput}
                name="address"
                type="text"
                className={
                  authState.errors&&authState.errors.address&&authState.operation === "signUp"?
                  "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                  "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
                placeholder={authState.errors&&authState.errors.address&&authState.operation === "signUp"?authState.errors.address:"Address"}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                value={signUpInput.email}
                onChange={handleInput}
                name="email"
                type="email"
                className={
                  authState.errors&&authState.errors.email&&authState.operation === "signUp"?
                  "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                  "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
                placeholder={authState.errors&&authState.errors.email&&authState.operation === "signUp"?authState.errors.email:"Email address"}
              />
            </div>
            <div className="mb-1">
              <div className="flex relative">
                  <div className="w-full">
                    <label htmlFor="password" className="sr-only">
                      Password
                    </label>
                    <input
                      value={signUpInput.password}
                      onChange={handleInput}
                      name="password"
                      type={!showPassword?"password":"text"}
                      className={
                        authState.errors&&authState.errors.password&&authState.operation === "signUp"?
                        "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                        "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                      }
                      placeholder={authState.errors&&authState.errors.password&&authState.operation === "signUp"?authState.errors.password:"Password"}
                    />
                  </div>
                  <div
                    onClick={()=>{setShowPassword(!showPassword)}}
                    className={
                        authState.errors&&authState.errors.password&&authState.operation === "signUp"?
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
            <div className="mb-1">
              <select 
              onChange={handleInput}
              name="role" 
              value={signUpInput.role}
              className={
                authState.errors&&authState.errors.role&&authState.operation === "signUp"?
                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
              }
              >
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="" >Select role</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Client</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Developer</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Delegate</option>
              </select>
            </div>
            {
              signUpInput.role !== "Client" ?
              <div className="mb-1">
                <label htmlFor="github_link" className="sr-only">
                  Github link
                </label>
                <input
                  value={signUpInput.github_link}
                  onChange={handleInput}
                  name="github_link"
                  type="text"
                  className={
                    authState.errors&&authState.errors.github_link&&authState.operation === "signUp"?
                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                  }
                  placeholder={authState.errors&&authState.errors.github_link&&authState.operation === "signUp"?authState.errors.github_link:"Github link"}
                />
              </div>:null
            }
            <div className="mb-1">
              <select 
              onChange={handleInput}
              name="field_of_work" 
              value={signUpInput.field_of_work}
              className={
                authState.errors&&authState.errors.field_of_work&&authState.operation === "signUp"?
                "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                "placeholder-dark/50 dark:placeholder-light/50 text-dark/50 dark:text-light/50 bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
              }
              >
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark" value="">Select field of work</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Programming</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Designing</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Content Writing</option>
                <option className="text-dark/50 dark:text-light/50 bg-light dark:bg-dark">Translation</option>
              </select>
            </div>
            <div className="mb-1">
              <label htmlFor="picture_personal_profile"
                className={
                  authState.errors&&authState.errors.picture_personal_profile&&authState.operation === "signUp"?
                  "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm" :
                  "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-2 relative block w-full appearance-none px-3 focus:z-10 focus:outline-none sm:text-sm"
                }
              >
                {
                  authState.errors&&authState.errors.picture_personal_profile&&authState.operation === "signUp"?
                  authState.errors.picture_personal_profile:
                  
                  picturePersonalProfile && picturePersonalProfile.name?
                  <span className="text-dark/50 dark:text-light/50">{picturePersonalProfile.name}</span>:
                  <span className="text-dark/50 dark:text-light/50">Picture personal profile</span>
                }
                <div
                  className={
                      authState.errors&&authState.errors.picture_personal_profile&&authState.operation === "signUp"?
                      "text-danger/50 dark:text-danger/50 hover:text-danger dark:hover:text-danger absolute right-1 top-1 cursor-pointer w-10 p-1 z-10" :
                      "text-dark/50 dark:text-light/50 hover:text-dark dark:hover:text-light absolute right-1 top-1 cursor-pointer w-10 p-1 z-10"
                  }
                >
                  <FaFileImage className="text-xl"/>
                </div>
              </label>
              <input
                onChange={handlePicturePersonalProfule}
                type="file"
                accept="image/png,image/jpg,image/jpeg"
                hidden={true}
                id="picture_personal_profile"
              />
            </div>
          </div>
          <div className="flex items-center justify-between my-4">
            <Link
              to="/sign-in"
              className="text-queen dark:text-king hover:opacity-75 text-sm mr-1"
            >
              Have an account?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="text-dark dark:text-light bg-dark/[0.05] dark:bg-light/[0.05] border-b-[2.5px] border-queen dark:border-king shadow-inner shadow-dark/10 dark:shadow-light/10 hover:opacity-75 text-center w-full py-2 transition-all duration-500 cursor-pointer text-sm px-4 rounded-md"
            >
            {
              authState.isLoading ? <FaSpinner className="inline text-xl animate-spin"/> : "SignUp"
            }
            </button>
          </div>
        </form>
      </div>
      <AnimationShapes/>
    </div>
  );
};
export default SignUp;