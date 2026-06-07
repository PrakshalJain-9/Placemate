import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function StudentManagement() {

    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');


    const [newStudent, setNewStudent] = useState({ name: '', email: '', rollNumber: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropDown] = useState(false);

    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [totalElements, setTotalElements] = useState(0);
    const [students, setStudents] = useState([]);


    async function fetchStudents() {
        setIsLoading(true);

        try {
            const response = await api.get("/api/superadmin/students", {
                params: {
                    size: size,
                    page: page,
                    search: searchQuery
                }
            })

            // console.log(size, page, searchQuery);
            // console.log(response.data);
            setTotalElements(response.data.totalElements);
            setTotalPages(response.data.totalPages);
            setStudents(response.data.content);
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(async () => {
            setSearchQuery(searchInput);
            setPage(0);

            if (searchInput.length >= 2) {
                try {
                    const res = await api.get("/api/superadmin/students", {
                        params: {
                            page: page,
                            size: size,
                            "search": searchInput
                        }
                    })

                    setSuggestions(res.data);
                    setShowDropDown(true);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setShowDropDown(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput])


    useEffect(() => {
        fetchStudents();
    }, [page, size, searchQuery]);


    async function handleAddStudent(e) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post("/api/superadmin/addstudent", newStudent);
            alert(`Invite sent to ${newStudent.email}`)
            console.log(newStudent);
            setNewStudent({ name: '', email: '', rollNumber: '' });
            fetchStudents();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }



    async function handleDeleteStudent(studentId) {
        if (!window.confirm("Delete this student?")) return;
        try {
            const response = await api.delete(`/api/superadmin/students/${studentId}`);
            console.log(studentId);
            fetchStudents();
        } catch (error) {
            console.log(error);
        }
    }

    async function updateStudentRole(studentId) {
        const inputRole = window.prompt("Enter new role (STUDENT or ADMIN):");
        if (!inputRole) return;

        const newRole = inputRole.toUpperCase();
        console.log(newRole)
        if (newRole !== "STUDENT" && newRole !== "ADMIN") {
            window.alert("You are not allowed to enter anything apart from student or admin");
            return;
        }
        try {
            const response = await api.patch(`/api/superadmin/students/${studentId}`, {
                "role": newRole
            });

            fetchStudents();
        } catch (error) {
            console.log(error);
        }
    }

    const handleRenotify = async (email, id) => {
        try {
            alert(`Renotifying ${email}`);
            const response = api.post(`/api/superadmin/students/renotify/${id}`);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSelectSuggestion = (student) => {
        setSearchInput(student.email);
        setShowDropDown(false);
        setSearchQuery(student.email);
    };

    return (
        <div>
            <div>
                <form onSubmit={handleAddStudent}>
                    <label htmlFor="studentName">Student Name</label>
                    <input type="text" name="studentName" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />

                    <label htmlFor="rollNumber">Roll Number</label>
                    <input type="text" name="rollNumber" value={newStudent.rollNumber} onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })} />

                    <label htmlFor="email">Email Id</label>
                    <input type="email" name="email" value={newStudent.email} onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })} />

                    <button type="submit" disabled={isSubmitting}> {isSubmitting === false ? 'Add Student' : "Please Wait..."}</button>
                </form>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onBlur={() => setTimeout(() => setShowDropDown(false), 200)}
                />

                {showDropdown && suggestions.length > 0 && (
                    <ul>
                        {suggestions.map(student => (
                            <li
                                key={student.id}
                                onClick={() => handleSelectSuggestion(student)}
                            >
                                <div>{student.name}</div>
                                <div>{student.email}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            students.map(student => (
                                <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                    <td>{student.role}</td>
                                    <td>{student.status}</td>

                                    <td>
                                        {student.status === "Pending" && <button onClick={() => handleRenotify(student.email, student.id)}>Renotify</button>}
                                        <button onClick={() => handleDeleteStudent(student.id)}>Delete Student</button>
                                        <button onClick={() => updateStudentRole(student.id, student.role)}>Change Student role</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

            </div>
            {
                totalPages > 0 && (
                    <div>
                        <div>
                            <label htmlFor="pageSize">
                                Rows per page:
                            </label>
                            <select
                                id="pageSize"
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(0);
                                }}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        <div>
                            Showing page {page + 1} of {totalPages}
                        </div>
                        <div>
                            <button onClick={() => setPage(prev => prev - 1)} disabled={page === 0}>
                                Previous
                            </button>
                            <button onClick={() => setPage(prev => prev + 1)} disabled={page >= totalPages - 1}>
                                Next
                            </button>
                        </div>
                    </div>
                )
            }


        </div>
    );
}