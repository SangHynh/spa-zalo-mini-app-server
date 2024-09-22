import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DarkModeProvider } from "./context/DarkModeContext"; // Import Provider

function App() {
  return (
    <DarkModeProvider>
      <div className="min-h-screen bg-white dark:bg-[#1E1E1E] text-black dark:text-white">
        <Outlet />
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          transition={Bounce}
        />
      </div>
    </DarkModeProvider>
  );
}

export default App;
