import DashboardLayout from '../../layouts/DashboardLayout';
import StudentManagement from './StudentManagement';

export default function StudentManagementPage() {
    return (
        <DashboardLayout title="Student Management">
            <StudentManagement />
        </DashboardLayout>
    );
}
