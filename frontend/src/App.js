import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard/index";
import Team from "./scenes/Team";
import Invoices from "./scenes/Invoices";
import Contacts from "./scenes/Contacts";
import Bar from "./scenes/Bar";
import Register from "./scenes/Register";
import Line from "./scenes/Line";
import Pie from "./scenes/Pie";
import FAQ from "./scenes/Faq";
import Geography from "./scenes/Geography";
import Calendar from "./scenes/Calendar";
import Login from "./scenes/Login";
import NotFound from "./scenes/NotFound";
import Profile from "./scenes/Profile";
import { useDispatch, useSelector } from "react-redux";
import { checkAdminAccess, userRegisterSuccess } from "./redux/userSlice";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  // const isAdmin = useSelector((state) => state.user.isAdmin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch an action that requires admin access
    dispatch(checkAdminAccess());
  }, [dispatch]);

  useEffect(() => {
    const storedAuthStatus = localStorage.getItem("isAuthenticated");

    if (storedAuthStatus) {
      try {
        const parsedAuthStatus = JSON.parse(storedAuthStatus);

        if (!parsedAuthStatus && window.location.pathname !== "/login") {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing stored authentication status:", error);
      }
    } else if (window.location.pathname !== "/login") {
      navigate("/login");
    }
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    // Retrieve the user data from local storage
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);

        // Dispatch the userRegisterSuccess action with the stored user data
        dispatch(userRegisterSuccess(userData));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Login />
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/form" element={<Register />} />
              <Route path="/line" element={<Line />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
