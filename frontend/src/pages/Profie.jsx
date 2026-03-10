import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getEmployeeById } from "../api/employeeApi";

const Profile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (user.employeeId) {
      getEmployeeById(user.employeeId).then(res =>
        setEmployee(res.data)
      );
    }
  }, [user]);

  if (!employee) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">
        My Profile
      </h1>

      <ProfileField label="Employee Code" value={employee.employeeCode} />
      <ProfileField label="Name" value={`${employee.firstName} ${employee.lastName}`} />
      <ProfileField label="Email" value={employee.email} />
      <ProfileField label="Phone" value={employee.phone} />
      <ProfileField label="Department" value={employee.department} />
      <ProfileField label="Role" value={employee.role} />
      <ProfileField label="Joining Date" value={employee.joiningDate} />
      <ProfileField label="Status" value={employee.employmentStatus} />
    </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="mb-3">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

export default Profile;
