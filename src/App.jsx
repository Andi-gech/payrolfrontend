import Header from "./components/Header";
import Home from "./Pages/Dashboard";
import Department from "./Pages/Department";
import { Routes, Route } from "react-router-dom";
import Employee from "./Pages/Employee";
import LoginPage from "./Pages/LoginPage";
import PayrollRecord from "./Pages/PayrollRecord";
import AttendanceRecord from "./Pages/AttendanceRecord";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useDarkSide from "./hooks/useDarkSide";
import { useEffect, useState } from "react";
import AuthOutlet from "@auth-kit/react-router/AuthOutlet";

function App() {
  const [colorTheme, setTheme] = useDarkSide(); // Custom hook for toggling themes
  const [darkTheme, setDarkTheme] = useState(
    createTheme({ palette: { mode: colorTheme } })
  );

  useEffect(() => {
    // Create a new theme whenever the colorTheme changes
    const theme = createTheme({ palette: { mode: colorTheme } });
    setDarkTheme(theme);
  }, [colorTheme]);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className="min-h-screen overflow-hidden bg-zinc-50 flex flex-row">
        <Header toggleTheme={setTheme} />{" "}
        {/* Assuming you pass the toggleTheme to Header if needed */}
        <Routes>
          <Route element={<AuthOutlet fallbackPath="/login" />}>
            <Route path="/" element={<Home />} />
            <Route path="/departments" element={<Department />} />
            <Route path="/Employee" element={<Employee />} />
            <Route path="/Record" element={<AttendanceRecord />} />
            <Route path="/Report" element={<PayrollRecord />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
