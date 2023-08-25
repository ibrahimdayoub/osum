import { FaAddressCard, FaChartLine, FaCrown, FaRegStar, FaStar } from 'react-icons/fa'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { rateUser } from '../../../Redux/Features/Users/usersSlice';
import { toastify } from '../../../Helper';

const InformationProfile = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const socketState = useSelector((state) => state.socket);
  const usersState = useSelector((state) => state.users);
  const [stars, setStars] = useState([])
  const [rate, setRate] = useState(0) //between 0 and 7
  const rateSubmit = (rate) => {
    if (user.role !== "Admin") {
      const data = {
        rate: rate,
        role: user.role
      }
      dispatch(rateUser({ id: user._id, data }))
    }
    else {
      return
    }
  }
  useEffect(() => {
    let rates = (user.rate_personal_profile?.filter((rate) => {
      return rate?.rater_id === authState.auth.user._id
    }))
    if (rates?.length > 0) {
      setRate(rates[0]?.rate)
    }
  }, [user])
  useEffect(() => {
    let stars_ = []
    for (let i = 1; i <= 7; i++) {
      if (i <= rate) {
        stars_.push(<span><FaStar onClick={() => { setRate(i - 1); rateSubmit(i - 1) }} className="m-0.5 cursor-pointer" /></span>)
      }
      else {
        stars_.push(<span><FaRegStar onClick={() => { setRate(i); rateSubmit(i) }} className="m-0.5 cursor-pointer" /></span>)
      }
    }
    setStars(stars_)
  }, [rate])
  useEffect(() => {
    if ((Date.now() - usersState.time < 100) && usersState.status === 200 && usersState.message && usersState.operation === "rateUser") {
      toastify("success", usersState.status, usersState.message)
      //Add Notification (When Rate User By Client, Developer, Delegate or Admin)
      socketState.socket.emit("addNotification", {
        receiversIds: [user._id],
        redirect: `profile/${user._id}`,
        message: "There is a new rate created, go to your profile and check it",
      })
    }
    else if ((Date.now() - usersState.time < 100) &&  (usersState.status === 400 || usersState.status === 401 || usersState.status === 403) && usersState.message && usersState.operation === "rateUser") {
      toastify("error", usersState.status, usersState.message)
    }
    else if ((Date.now() - usersState.time < 100) && usersState.status === 404 && usersState.message && usersState.operation === "rateUser") {
      toastify("error", usersState.status, usersState.message)
    }
    else if ((Date.now() - usersState.time < 100) && usersState.status === 500 && usersState.message && usersState.operation === "rateUser") {
      toastify("warn", usersState.status, usersState.message)
      setTimeout(() => {
        navigate(0)
      }, 5000);
    }
  }, [usersState.status, usersState.message])
  return (
    <div className="bg-dark/[0.025] dark:bg-light/[0.025] mb-2 py-2 relative text-center sm:flex flex-wrap items-center justify-start rounded-md">
      {/*Picture*/}
      <div
        style={{ backgroundImage: `url(${user.picture_personal_profile ? process.env.REACT_APP_BACK_END_URL + ((user.picture_personal_profile).substring(7)).replace("\\", "/") : null})` }}
        className="text-queen dark:text-king shadow-sm shadow-queen dark:shadow-king bg-cover bg-center relative mx-auto sm:mx-6 my-2 w-36 h-36 rounded-full overflow-hidden">
        {
          !user.picture_personal_profile ?
            <FaCrown className="text-6xl absolute top-10 left-10" /> :
            null
        }
      </div>
      {/*Personal*/}
      <div className="mx-4 sm:mx-0 flex-grow text-start sm:flex items-start justify-start flex-col px-2 mt-4 sm:mt-0 text-sm">
        <h2 className="text-lg text-dark dark:text-light mb-2 border-b border-dark/50 dark:border-light/50">
          <FaAddressCard className="inline text-xl mb-1 mr-2" />
          Personal Info:
        </h2>
        <p className="ml-1">
          <span className=" text-dark dark:text-light mr-1">Name:</span>
          <span className="text-dark/50 dark:text-light/50">{`${user.first_name} ${user.last_name}`}</span>
        </p>
        <p className="ml-1">
          <span className=" text-dark dark:text-light mr-1">Address:</span>
          <span className="text-dark/50 dark:text-light/50">{user.address}</span>
        </p>
        <p className="ml-1">
          <span className=" text-dark dark:text-light mr-1">Email:</span>
          <span className="text-dark/50 dark:text-light/50">{user.email}</span>
        </p>
        {
          user.role === "Developer" || user.role === "Delegate" ?
            <p className="ml-1">
              <span className=" text-dark dark:text-light mr-1">Github:</span>
              <a href={user.github_link} target="_blank" className="text-dark/50 dark:text-light/50" rel="noreferrer">{user.github_link}</a>
            </p> :
            null
        }
        <p className="ml-1">
          <span className=" text-dark dark:text-light mr-1">Role:</span>
          <span className="text-dark/50 dark:text-light/50">{user.role}</span>
        </p>
        {
          user.role !== "Admin" ?
            <p className="ml-1">
              <span className=" text-dark dark:text-light mr-1">Work Field:</span>
              <span className="text-dark/50 dark:text-light/50">{user.field_of_work}</span>
            </p> :
            null
        }
      </div>
      {/*Profile*/}
      <div className="mx-4 sm:mx-0 flex-grow text-start sm:flex items-start justify-start flex-col px-2 mt-4 sm:mt-0 text-sm">
        <h2 className=" text-lg text-dark dark:text-light mb-2 border-b border-dark/50 dark:border-light/50">
          <FaChartLine className="inline text-xl mb-1 mr-2" />
          Profile Info:
        </h2>
        {
          user.role !== "Admin" ?
            <>
              <p className="ml-1">
                <span className=" text-dark dark:text-light mr-1">Views:</span>
                <span className="text-dark/50 dark:text-light/50">{user.views_personal_profile}</span>
              </p>
              <p className="ml-1">
                <span className=" text-dark dark:text-light mr-1">Rate:</span>
                <span className="text-dark/50 dark:text-light/50">
                  {
                    user.rate_personal_profile.length > 0 ?
                      Math.round((user.rate_personal_profile.reduce((counter, object) => { return counter + object.rate }, 0)) / user.rate_personal_profile.length)
                      : 0
                  }/7
                  {
                    user.rate_personal_profile.length ?
                      <span> ({user.rate_personal_profile.length} votes) </span> :
                      <span> (0 votes) </span>
                  }

                </span>
              </p>
            </> :
            null
        }
        <p className="ml-1">
          <span className=" text-dark dark:text-light mr-1">Created:</span>
          <span className="text-dark/50 dark:text-light/50">{format(new Date(user.createdAt), 'dd/MM/yyyy')}</span>
        </p>
      </div>
      {
        user._id !== authState.auth.user._id ?
          <>
            {/* Rate */}
            <div className="text-queen dark:text-king text-lg mx-7 mt-4 sm:mx-2 sm:mt-0 w-fit h-fit flex sm:flex-col-reverse justify-center items-center">
              {stars}
            </div>
          </> :
          null
      }
    </div>
  )
}
export default InformationProfile