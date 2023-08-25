import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import SideNavGo from '../Components/Shared/SideNavGo'
import Home from '../Layouts/Shared/Home'
import Profile from '../Layouts/Shared/Profile'
import Support from '../Layouts/Shared/Support'
import Notifications from '../Layouts/Shared/Notifications'
import Messenger from '../Layouts/Shared/Messenger'
import Search from '../Layouts/Shared/Search'
import NotFound from '../Layouts/Shared/NotFound'

const AdminRoutes = () => {
    const authState = useSelector((state) => state.auth);
    const routesArray = [
        { path: 'home', element: Home },
        { path: 'profile/:id', element: Profile },
        { path: 'support', element: Support },
        { path: 'notifications', element: Notifications },
        { path: 'messenger', element: Messenger },
        { path: 'search', element: Search },
    ]
    return (
        <>
            {
                authState.auth && authState.auth.user.role === "Admin" ?
                    <>
                        <SideNavGo />
                        <Routes>
                            <Route index element={<Home />} />
                            {
                                routesArray.map((route) => {
                                    return <Route key={route.path} path={route.path} element=<route.element /> />
                                })
                            }
                            <Route path="*" element={<NotFound reDirTo={"/admin"} />} />
                        </Routes>
                    </> :
                    <>
                        <Navigate to="/sign-in" />
                    </>
            }
        </>
    )
}
export default AdminRoutes