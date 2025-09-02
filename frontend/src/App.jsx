import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Box } from "@mui/material"
import AppLayout from "./components/AppLayout";
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import { useAuth } from "./context/AuthContext"

import Inbox from "./pages/Inbox"
import Starred from "./pages/Starred"
import Snoozed from "./pages/Snoozed"
import Sent from "./pages/Sent"
import Drafts from "./pages/Drafts"
import Compose from "./pages/Compose"
import MailDetail from "./pages/MailDetail"
import Trash from "./pages/Trash"
import Login from "./pages/Login"
import Register from "./pages/Register"


import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  const { user } = useAuth()
  const location = useLocation()

  const isAuthRoute = location.pathname === "/login" || location.pathname === "/register"

  return (
    <>
    
      {/* Global Toast Container */}
      <ToastContainer position="bottom-center" autoClose={3000} />

      {/* Only show Header and Sidebar if not on /login or /register */}
      {!isAuthRoute && user && <Header />}
      
      <Box sx={{ display: "flex" }}>
        {!isAuthRoute && user && <Sidebar />}
        
        <Box sx={{ flexGrow: 1, p: 2, mt: !isAuthRoute && user ? "64px" : 0 }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to={user ? "/inbox" : "/login"} />} />

            {/* Protected Routes */}
            <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
            <Route path="/starred" element={<ProtectedRoute><Starred /></ProtectedRoute>} />
            <Route path="/snoozed" element={<ProtectedRoute><Snoozed /></ProtectedRoute>} />
            <Route path="/sent" element={<ProtectedRoute><Sent /></ProtectedRoute>} />
            <Route path="/drafts" element={<ProtectedRoute><Drafts /></ProtectedRoute>} />
            <Route path="/compose" element={<ProtectedRoute><Compose /></ProtectedRoute>} />
            <Route path="/mail/:id" element={<ProtectedRoute><MailDetail /></ProtectedRoute>} />
            <Route path="/trash" element={<ProtectedRoute><Trash /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={user ? "/inbox" : "/login"} />} />
                  
          </Routes>
            

        </Box>
      </Box>
    </>
  )
}
