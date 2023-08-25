import { Routes, Route } from 'react-router-dom'
import SideNavStop from '../Components/Welcome/SideNavStop'
import Home from '../Layouts/Welcome/Home'
import SignIn from '../Layouts/Welcome/SignIn'
import SignUp from '../Layouts/Welcome/SignUp'
import ForgotPassword from '../Layouts/Welcome/ForgotPassword'
import ResetPassword from '../Layouts/Welcome/ResetPassword'
import NotFound from '../Layouts/Shared/NotFound'

const WelcomeRoutes = () => {
    const routesArray = [
        { path: 'home', element: Home },
        { path: 'sign-up', element: SignUp },
        { path: 'sign-in', element: SignIn },
        { path: 'forgot-password', element: ForgotPassword },
        { path: 'reset-password/:id', element: ResetPassword },
    ];
    return (
        <>
            <SideNavStop />
            <Routes>
                <Route index element={<Home />} />
                {
                    routesArray.map((route) => {
                        return <Route key={route.path} path={route.path} element=<route.element /> />
                    })
                }
                <Route path="*" element={<NotFound reDirTo={"/"} />} />
            </Routes>
        </>
    )
}
export default WelcomeRoutes