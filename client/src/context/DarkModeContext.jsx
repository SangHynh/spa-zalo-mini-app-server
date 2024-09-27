import React, { createContext, useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Tạo Context
export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  // Lấy trạng thái dark mode từ localStorage (nếu có), mặc định là false
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode ? JSON.parse(storedDarkMode) : false;
  });

  // Cập nhật class 'dark' cho phần tử HTML khi đổi nền
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Lưu trạng thái dark mode vào localStorage
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Tạo MUI theme
  const theme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light", // Áp dụng theme dựa trên isDarkMode
    },
  });

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </DarkModeContext.Provider>
  );
};
