import { Navigate, Routes, BrowserRouter, Route } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import RegisterSuperAdmin from './pages/SuperAdmin/RegisterSuperAdmin';
import SuperAdminLogin from './pages/SuperAdmin/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdmin/SuperAdminDashboard';
import UserLogin from './pages/User/UserLogin';
import UserDashboard from './pages/User/UserDashboard';
import UserSignUp from './pages/User/UserSignUp';
import AdminRoomManagement from './pages/Admin/AdminRoomManagement';
import AdminScheduleManagement from './pages/Admin/AdminScheduleManagement';
import AdminCompanyManagement from './pages/Admin/AdminCompanyManagement';
import StudentManagementPage from './pages/SuperAdmin/StudentManagementPage';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public Auth Routes */}
                <Route element={<PublicRoute />}>
                    <Route path="/admin/login" element={<SuperAdminLogin />} />
                    <Route path="/admin/register" element={<RegisterSuperAdmin />} />
                    <Route path="/login" element={<UserLogin />} />
                    <Route path="/register" element={<UserSignUp />} />
                </Route>

                {/* SuperAdmin Routes — full access to all management pages */}
                <Route element={<ProtectedRoute allowedRoles={['SUPERADMIN', 'INSTITUTION']} />}>
                    <Route path="/admin/dashboard" element={<SuperAdminDashboard />} />
                    <Route path="/admin/dashboard/rooms" element={<AdminRoomManagement />} />
                    <Route path="/admin/dashboard/schedules" element={<AdminScheduleManagement />} />
                    <Route path="/admin/dashboard/companies" element={<AdminCompanyManagement />} />
                    <Route path="/admin/dashboard/students" element={<StudentManagementPage />} />
                </Route>

                {/* Student / Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ADMIN']} />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/dashboard/rooms" element={<AdminRoomManagement />} />
                    <Route path="/dashboard/schedules" element={<AdminScheduleManagement />} />
                    <Route path="/dashboard/companies" element={<AdminCompanyManagement />} />
                </Route>

                {/* Fallback 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
