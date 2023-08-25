import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSupports, updateSupport, deleteSupport } from "../../Redux/Features/Supports/supportsSlice";
import { FaChevronRight, FaEdit, FaSpinner, FaTrash, FaList, FaPaperPlane } from "react-icons/fa";
import { format } from 'date-fns'
import Container from "../../Components/Shared/Container";
import { toastify } from "../../Helper";

const Supports = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const socketState = useSelector((state) => state.socket);
  const supportsState = useSelector((state) => state.supports);
  const [medScreen, setIsMedScreen] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(null)
  const [receiverId, setReceiverId] = useState(null)
  //Update
  const [UpdateInput, setUpdateInput] = useState({
    reply: ""
  });
  const handleUpdateInput = (e) => {
    e.persist();
    setUpdateInput({ ...UpdateInput, [e.target.name]: e.target.value });
  };
  const UpdateSubmit = (id) => {
    const data = {
      reply: UpdateInput.reply
    }
    dispatch(updateSupport({ id, data }))
  };
  useEffect(() => {
    dispatch(getSupports())

    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setIsMedScreen(true)
      } else {
        setIsMedScreen(false)
      }
    })
  }, [])
  useEffect(() => {
    if ((Date.now() - supportsState.time < 100) && supportsState.status === 200 && supportsState.message && supportsState.operation === "getSupports") {
      toastify("success", supportsState.status, supportsState.message)
    }
    else if ((Date.now() - supportsState.time < 100) && (supportsState.status === 401 || supportsState.status === 403 || supportsState.status === 404) && supportsState.message && supportsState.operation === "getSupports") {
      toastify("error", supportsState.status, supportsState.message)
    }
    else if ((Date.now() - supportsState.time < 100) && supportsState.status === 500 && supportsState.message && supportsState.operation === "getSupports") {
      toastify("warn", supportsState.status, supportsState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }

    if ((Date.now() - supportsState.time < 100) && supportsState.status === 200 && supportsState.message && supportsState.operation === "updateSupport") {
      toastify("success", supportsState.status, supportsState.message)
      setOpenUpdate(null)
      //Add Notification (When Update Support By Admin)
      socketState.socket.emit("addNotification", {
        receiversIds: [receiverId],
        redirect: "support",
        message: "From support, your inquiry was recently answered, please check it",
      })
    }
    else if ((Date.now() - supportsState.time < 100) && (supportsState.status === 400 || supportsState.status === 401 || supportsState.status === 403) && supportsState.message && supportsState.operation === "updateSupport") {
      toastify("success", supportsState.status, supportsState.message)
    }
    else if ((Date.now() - supportsState.time < 100) && supportsState.status === 404 && supportsState.message && supportsState.operation === "updateSupport") {
      toastify("error", supportsState.status, supportsState.message)
      setUpdateInput({
        reply: ""
      })
    }
    else if ((Date.now() - supportsState.time < 100) && supportsState.status === 500 && supportsState.message && supportsState.operation === "updateSupport") {
      toastify("warn", supportsState.status, supportsState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }

    if ((Date.now() - supportsState.time < 100) && supportsState.status === 200 && supportsState.message && supportsState.operation === "deleteSupport") {
      toastify("success", supportsState.status, supportsState.message)
    }
    else if ((Date.now() - supportsState.time < 100) && (supportsState.status === 401 || supportsState.status === 403 || supportsState.status === 404) && supportsState.message && supportsState.operation === "deleteSupport") {
      toastify("error", supportsState.status, supportsState.message)
    }
    else if ((Date.now() - supportsState.time < 100) && supportsState.status === 500 && supportsState.message && supportsState.operation === "deleteSupport") {
      toastify("warn", supportsState.status, supportsState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }
  }, [supportsState.status, supportsState.message])
  console.log(supportsState.supports)
  return (
    <Container>
      {/* Head */}
      <div className="text-dark/75 dark:text-light/75  mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
        {/* Title */}
        <h1 className="flex-1" style={{ letterSpacing: "2px" }}>SUPPORT</h1>
        {/* Buttons */}
        <div className="flex justify-between items-center gap-2 md:gap-4">
          <Link to={`/${(authState.auth.user.role).toLowerCase()}/profile/${authState.auth.user._id}?tab=support`}>
            <FaChevronRight className=" hover:opacity-75 transition-all duration-500" />
          </Link>
        </div>
      </div>
      {/* Records */}
      <>
        {
          supportsState.supports.length === 0 ?
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-lg py-10 text-center rounded animation duration-1000 slide-in-up">
              <FaList className="inline mb-1 mr-2" />
              No records found
            </div> :
            <div className="grid md:grid-cols-2 gap-2">
              {
                supportsState.supports.map(support => {
                  return <>
                    {/* Record */}
                    <div className="bg-dark/[0.025] dark:bg-light/[0.025] text-sm px-4 py-2 rounded animation slide-in-left">
                      {/* Subject & Controllers */}
                      <div className="flex justify-between items-start -mb-1">
                        {/* Subject */}
                        <div>
                          <span className="text-dark dark:text-light mr-1">
                            Subject:
                          </span>
                          <span className="text-dark/50 dark:text-light/50">{support.subject}</span>
                        </div>
                        {/* Controllers */}
                        <div className=" min-w-max">
                          {
                            authState.auth.user.role === "Admin" ?
                              <button onClick={() => {
                                setOpenUpdate(openUpdate === support._id ? "" : support._id);
                                setUpdateInput({ ...UpdateInput, reply: support.reply ? support.reply : "" })
                              }}>
                                {
                                  (supportsState.isLoading && supportsState.operation === "updateSupport") ?
                                    <FaSpinner className="text-base text-queen dark:text-king animate-spin mr-1" /> :
                                    <FaEdit className="text-base text-queen dark:text-king hover:opacity-75 mr-1 transition-all duration-300" />
                                }
                              </button> :
                              null
                          }
                          <button onClick={() => { dispatch(deleteSupport({ id: support._id })) }}>
                            {
                              (supportsState.isLoading && supportsState.operation === "deleteSupport") ?
                                <FaSpinner className="text-base text-queen dark:text-king  animate-spin" /> :
                                <FaTrash className="text-base text-queen dark:text-king  hover:opacity-75 transition-all duration-300" />
                            }
                          </button>
                        </div>
                      </div>
                      {/* Message */}
                      <div>
                        <span className="text-dark dark:text-light mr-1">
                          Message:
                        </span>
                        <span className="text-dark/50 dark:text-light/50">{support.message}</span>
                      </div>
                      {/* Reply */}
                      <div>
                        <span className="text-dark dark:text-light mr-1">
                          Reply:
                        </span>
                        <span className="text-dark/50 dark:text-light/50">{support.reply ? support.reply : "..."}</span>
                      </div>
                      {
                        authState.auth.user.role === "Admin" && openUpdate === support._id ?
                          <div className="m-2 animation slide-in-down duration-500 relative">
                            <div>
                              <label htmlFor="reply" className="sr-only">
                                Reply
                              </label>
                              <input
                                value={UpdateInput.reply}
                                onChange={handleUpdateInput}
                                name="reply"
                                type="text"
                                className={
                                  supportsState.errors && supportsState.errors.reply && supportsState.operation === "updateSupport" ?
                                    "placeholder-danger/50 dark:placeholder-danger/50 text-danger dark:text-danger bg-transparent border-b border-danger/50 dark:border-danger/50 focus:border-danger dark:focus:border-danger py-1 relative block w-full appearance-none pl-2 pr-8 focus:z-10 focus:outline-none sm:text-sm" :
                                    "placeholder-dark/50 dark:placeholder-light/50 text-dark dark:text-light bg-transparent border-b border-dark/50 dark:border-light/50 focus:border-dark dark:focus:border-light py-1 relative block w-full appearance-none pl-2 pr-8 focus:z-10 focus:outline-none sm:text-sm"
                                }
                                placeholder={supportsState.errors && supportsState.errors.reply ? supportsState.errors.reply : "Reply"}
                              />
                            </div>
                            <button onClick={() => { setReceiverId(support.sender_id._id); UpdateSubmit(support._id) }} className="absolute top-1 right-1 z-10 px-1">
                              {
                                (supportsState.isLoading && supportsState.operation === "updateSupport") ? <FaSpinner className="text-xl animate-spin inline mr-1" /> :
                                  <>
                                    <FaPaperPlane className=" text-lg text-queen dark:text-king hover:opacity-75" />
                                  </>
                              }
                            </button>
                          </div> :
                          null
                      }
                      {
                        authState.auth.user.role === "Admin" ?
                          <>
                            {/* Requester */}
                            <div>
                              <span className="text-dark dark:text-light mr-1">
                                Requester:
                              </span>
                              <Link
                                to={`../profile/${support.sender_id._id}/`} state={{ targetRole: support.sender_id.role, backTo: "support" }}
                                className="text-dark/50 dark:text-light/50">
                                {`${support.sender_id.first_name} ${support.sender_id.last_name}`}
                              </Link>
                            </div>
                          </> : null
                      }
                      {/* Asked At */}
                      <div>
                        <span className="text-dark dark:text-light mr-1">
                          Asked:
                        </span>
                        <span className="text-dark/50 dark:text-light/50">{format(new Date(support.createdAt), 'kk:mm dd/MM/yyyy')}</span>
                      </div>
                      {/* Answered At */}
                      <div>
                        <span className="text-dark dark:text-light mr-1">
                          Answered:
                        </span>
                        <span className="text-dark/50 dark:text-light/50">{support.createdAt !== support.updatedAt ? format(new Date(support.updatedAt), 'kk:mm dd/MM/yyyy') : "..."}</span>
                      </div>
                    </div>
                  </>
                })
              }
              {
                !medScreen && (supportsState.supports.length % 2 === 1) ?
                  <>
                    {/* Empty */}
                    <div className="bg-dark/[0.025] dark:bg-light/[0.025] px-4 p-2 rounded animation slide-in-left"></div>
                  </> :
                  null
              }
            </div>
        }
      </>
    </Container>
  )
}
export default Supports