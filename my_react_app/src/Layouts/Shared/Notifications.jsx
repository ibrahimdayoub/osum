import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications, deleteNotification } from "../../Redux/Features/Notifications/notificationsSlice";
import { FaSpinner, FaTrash, FaList } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns'
import Container from "../../Components/Shared/Container";
import { toastify } from "../../Helper";

const Notification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const notificationsState = useSelector((state) => state.notifications);
  const [medScreen, setIsMedScreen] = useState(false)
  const deleteNotificationSubmit = (notificationId) => {
    const data = {
      id: notificationId
    }
    dispatch(deleteNotification(data))
  }
  useEffect(() => {
    dispatch(getNotifications())
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setIsMedScreen(true)
      } else {
        setIsMedScreen(false)
      }
    })
  }, [])
  useEffect(() => {
    if ((Date.now() - notificationsState.time < 100) && notificationsState.status === 200 && notificationsState.message && notificationsState.operation === "getNotifications") {
      toastify("success", notificationsState.status, notificationsState.message)
    }
    else if ((Date.now() - notificationsState.time < 100) && (notificationsState.status === 401 || notificationsState.status === 403 || notificationsState.status === 404) && notificationsState.message && notificationsState.operation === "getNotifications") {
      toastify("error", notificationsState.status, notificationsState.message)
    }
    else if ((Date.now() - notificationsState.time < 100) && notificationsState.status === 500 && notificationsState.message && notificationsState.operation === "getNotifications") {
      toastify("warn", notificationsState.status, notificationsState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }

    if ((Date.now() - notificationsState.time < 100) && notificationsState.status === 200 && notificationsState.message && notificationsState.operation === "deleteNotifications") {
      toastify("success", notificationsState.status, notificationsState.message)
    }
    else if ((Date.now() - notificationsState.time < 100) && (notificationsState.status === 401 || notificationsState.status === 403 || notificationsState.status === 404) && notificationsState.message && notificationsState.operation === "deleteNotifications") {
      toastify("error", notificationsState.status, notificationsState.message)
    }
    else if ((Date.now() - notificationsState.time < 100) && notificationsState.status === 500 && notificationsState.message && notificationsState.operation === "deleteNotifications") {
      toastify("warn", notificationsState.status, notificationsState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }
  }, [notificationsState.status, notificationsState.message])
  return (
    <Container>
      {/* Head */}
      <div className="text-dark/75 dark:text-light/75 mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
        {/* Title */}
        <h1 className="flex-1" style={{ letterSpacing: "2px" }}>Notifications</h1>
      </div>
      {/* Records */}
      <>
        {
          notificationsState.notifications.length === 0 ?
            <div className="text-dark/50 dark:text-light/50 bg-dark/[0.025] dark:bg-light/[0.025] text-lg py-10 text-center rounded animation duration-1000 slide-in-up">
              <FaList className="inline mb-1 mr-2" />
              No records found
            </div> :
            <div className="grid md:grid-cols-2 gap-2">
              {
                notificationsState.notifications.map(notification => {
                  return <>
                    {/* Record */}
                    <div
                      className={
                        ((notification.receivers.filter((receiver) => { return receiver?.receiver_id === authState.auth.user._id }))[0]).is_new ?
                          "bg-dark/[0.05] dark:bg-light/[0.05] py-4 px-4 rounded animation slide-in-left flex justify-between items-start gap-2" :
                          "bg-dark/[0.025] dark:bg-light/[0.025] py-4 px-4 rounded animation slide-in-left flex justify-between items-start gap-2"
                      }
                    >
                      {/* Message */}
                      <Link to={`/${(authState.auth.user.role).toLowerCase()}/${(notification.redirect)}`}>
                        <span className="text-dark dark:text-light mr-1">Message:</span>
                        <span className="text-dark/50 dark:text-light/50">{notification.message}, {formatDistanceToNow(new Date(notification.createdAt), { includeSeconds: true, addSuffix: true })}</span>
                      </Link>
                      <button onClick={() => { deleteNotificationSubmit(notification._id) }}>
                        {
                          (notificationsState.isLoading && notificationsState.operation === "deletNotification") ?
                            <FaSpinner className="text-base text-queen dark:text-king  animate-spin" /> :
                            <FaTrash className="text-base text-queen dark:text-king  hover:opacity-75 transition-all duration-300" />
                        }
                      </button>
                      {/* <button onClick={() => { deletePostSubmit(post._id) }} className="mr-2">
                        {
                          (postsState.isLoading && postsState.operation === "deletePost") ? <FaSpinner className="inline text-base ml-1" /> :
                            <>
                              <FaTrash className="inline text-start text-base" />
                            </>
                        }
                      </button> */}
                    </div>
                  </>
                })
              }
              {
                !medScreen && (notificationsState.notifications.length % 2 === 1) ?
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
export default Notification