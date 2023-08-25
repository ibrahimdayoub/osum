import { useSelector } from "react-redux";
import Container from "../../Components/Shared/Container"
import AddPost from "../../Components/Shared/Posts/AddPost"
import GetPosts from "../../Components/Shared/Posts/GetPosts";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import GetStories from "../../Components/Shared/Stories/GetStories";
import AdminDashboard from "../../Components/Admin/Home/AdminDashboard";

const Home = () => {
  const authState = useSelector((state) => state.auth);
  return (
    <Container>
      {/* Head */}
      <div className="text-dark/75 dark:text-light/75 mb-2 flex flex-wrap justify-between items-center gap-1 font-bold text-2xl md:text-4xl">
        {/* Title */}
        <h1 className="flex-1" style={{ letterSpacing: "2px" }}>
          {
            authState.auth.user.role !== "Admin" ?
              "Home" :
              "Dashboard"
          }
        </h1>
        {
          authState.auth.user.role !== "Admin" ?
            <>
              {/* Buttons */}
              < div className="flex justify-between items-center gap-2 md:gap-4">
                <Link to={`/${(authState.auth.user.role).toLowerCase()}/search`}>
                  <FaSearch className=" hover:opacity-75 transition-all duration-500" />
                </Link>
              </div>
            </> :
            null
        }
      </div>
      {
        authState.auth.user.role !== "Admin" ?
          <>
            {/* Stories */}
            <GetStories location={"home"} />
            {/* Posts */}
            <AddPost />
            <GetPosts location={"home"} />
          </> :
          <AdminDashboard />
      }
    </Container>
  )
}
export default Home

  // First Modal Way
  // const themeState = useSelector((state) => state.theme);
  // const [openModal, setOpenModal] = useState(false);
  // const modalStyle = {
  //   content: {
  //     top: '50%',
  //     left: '50%',
  //     right: 'auto',
  //     bottom: 'auto',
  //     marginRight: '-50%',
  //     transform: 'translate(-50%, -50%)',
  //     width: '360px',
  //     height: '120px',
  //     borderRadius: '8px',
  //     background: themeState.theme === "dark" ? "#121c2d" : "#f6f6f6",
  //     color: themeState.theme === "dark" ? "#f6f6f6" : "#121c2d",
  //     borderColor: themeState.theme === "dark" ? "#f6f6f6" : "#121c2d",
  //     borderWidth: '0.5px',
  //     padding: '0px',
  //     fontSize: '16px'
  //   }
  // };
  // ----------------------------------------------------------------------------------------------
  // < button onClick = {() => setOpenModal(true)}> Delete</button >
  // <Modal isOpen={openModal} style={modalStyle} >
  //   <div className="p-4">
  //     <p className="text-center text-lg px-4 mb-4">
  //       Please confirm delete proccess !
  //     </p>
  //     <div className="flex justify-around items-center">
  //       <button onClick={() => setOpenModal(false)} className="text-sm rounded-md transition-all duration-500 shadow-dark/20 hover:opacity-75 bg-light/[0.075] shadow-inner border-dark/50 border-b-[3px] py-1 flex justify-center items-center w-24">
  //         <FaTimes className="inline mr-1" />
  //         Cancel
  //       </button>
  //       <button className="text-sm rounded-md transition-all duration-500 shadow-dark/20 hover:opacity-75 bg-light/[0.075] shadow-inner border-dark/50 border-b-[3px] py-1 flex justify-center items-center w-24">
  //         <FaCheck className="inline mr-1" />
  //         Ok
  //       </button>
  //     </div>
  //   </div>
  // </Modal>

  // Second Modal Way
  // const [openDeletePostModal, setOpenDeletePostModal] = useState(false);
  // ----------------------------------------------------------------------------------------------
  // < button onClick = {() => setOpenDeletePostModal(true)}> Delete</button >
  // {
  //   confirmModal(openDeletePostModal, setOpenDeletePostModal, "delete", deletePost, 1)
  // }