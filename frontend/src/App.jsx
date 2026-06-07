import { useState } from 'react'
import { Navigate, Routes } from 'react-router-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { ProtectedRoute } from './routes/ProtectedRoute'
import RegisterSuperAdmin from './pages/SuperAdmin/RegisterSuperAdmin'
import SuperAdminLogin from './pages/SuperAdmin/SuperAdminLogin'
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard'
import UserLogin from './pages/User/UserLogin'
import UserDashboard from './pages/User/UserDashboard'
import UserSignUp from './pages/User/UserSignUp'
import AdminRoomManagement from './pages/Admin/AdminRoomManagement'
import AdminScheduleManagement from './pages/Admin/AdminScheduleManagement'
import AdminCompanyManagement from './pages/Admin/AdminCompanyManagement'

function App() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to="/student/login" replace />} />
            <Route path="/superadmin/login" element={<SuperAdminLogin />} />
            <Route path="/superadmin/register" element={<RegisterSuperAdmin />} />
            <Route path="/student/login" element={<UserLogin />} />
            <Route path="/student/signup" element={<UserSignUp />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/superadmin/dashboard/home" element={<SuperAdminDashboard />} />
                <Route path="/student/dashboard/home" element={<UserDashboard />} />
                <Route path="/student/dashboard/admin/room-management" element={<AdminRoomManagement />} />
                <Route path="/student/dashboard/admin/schedule-management" element={<AdminScheduleManagement />} />
                <Route path="/student/dashboard/admin/company-management" element={<AdminCompanyManagement />} />
            </Route>
        </Routes>
    </BrowserRouter>
}

export default App
