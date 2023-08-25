import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import qestion_mark from "../../Images/qestion_mark.png"
import Container from "../../Components/Shared/Container";
import { toastify } from "../../Helper";

const NotFound = ({ reDirTo }) => {
  const navigate = useNavigate()
  useEffect(() => {
  toastify("info", 404, "Page is not found")
    setTimeout(() => {
      navigate(reDirTo)
    }, 2500)
  }, [])
  return (
    <Container>
      <div className="bg-dark/[0.025] dark:bg-light/[0.025] rounded-md pb-4 text-center">
        <img src={qestion_mark} className="sm:max-w-sm md:max-w-md inline-block" alt="qestion_mark" />
        <div>
          <p className="text-dark/50 dark:text-light/50 -mt-2 text-xs sm:text-lg">Page is not found</p>
        </div>
      </div>
    </Container>
  );
}
export default NotFound