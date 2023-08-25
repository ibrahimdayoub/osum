import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import SideNavGo from '../Components/Shared/SideNavGo'
import Home from '../Layouts/Shared/Home'
import Profile from '../Layouts/Shared/Profile'
import Support from '../Layouts/Shared/Support'
import Notifications from '../Layouts/Shared/Notifications'
import Messenger from '../Layouts/Shared/Messenger'
import Search from '../Layouts/Shared/Search'
import Teams from '../Layouts/Shared/Teams'
import Tasks from '../Layouts/Shared/Tasks'
import NotFound from '../Layouts/Shared/NotFound'

const DelegateRoutes = () => {
    const authState = useSelector((state) => state.auth);
    const routesArray = [
        { path: 'home', element: Home },
        { path: 'profile/:id', element: Profile },
        { path: 'support', element: Support },
        { path: 'notifications', element: Notifications },
        { path: 'messenger', element: Messenger },
        { path: 'search', element: Search },
        { path: 'teams', element: Teams },
        { path: 'tasks', element: Tasks },
    ]
    return (
        <>
            {
                authState.auth && authState.auth.user.role === "Delegate" ?
                    <>
                        <SideNavGo />
                        <Routes>
                            <Route index element={<Home />} />
                            {
                                routesArray.map((route) => {
                                    return <Route key={route.path} path={route.path} element=<route.element /> />
                                })
                            }
                            <Route path="*" element={<NotFound reDirTo={"/delegate"} />} />
                        </Routes>
                    </> :
                    <>
                        <Navigate to="/sign-in" />
                    </>
            }
        </>
    )
}
export default DelegateRoutes