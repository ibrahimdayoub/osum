import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import WelcomeRoutes from './Routes/WelcomeRoutes'
import ClientRoutes from './Routes/ClientRoutes'
import DeveloperRoutes from './Routes/DeveloperRoutes'
import DelegateRoutes from './Routes/DelegateRoutes'
import AdminRoutes from './Routes/AdminRoutes'
import axios from 'axios';

axios.defaults.withCredentials = false;
axios.defaults.baseURL = process.env.REACT_APP_BACK_END_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post['Accept'] = 'application/json';
axios.interceptors.request.use(function (config) {
  const auth = JSON.parse(localStorage.getItem('auth'));
  config.headers.Authorization = auth ? `Bearer ${auth.token}` : ``;
  return config;
});

const App = () => {
  const themeState = useSelector((state) => state.theme);
  return (
    <div className={themeState.theme === "dark" ? "dark" : "light"}>
      <div className="bg-light dark:bg-dark min-h-screen font-mono">
        <Router>
          <Routes>
            <Route path="/*" element={<WelcomeRoutes />} exact={true} />
            <Route path="/client/*" element={<ClientRoutes />} exact={true} />
            <Route path="/developer/*" element={<DeveloperRoutes exact={true} />} />
            <Route path="/delegate/*" element={<DelegateRoutes exact={true} />} />
            <Route path="/admin/*" element={<AdminRoutes />} exact={true} />
          </Routes>
        </Router>
        <ToastContainer />
      </div>
    </div>
  )
}
export default App