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
    return (
      <div className="bg-white p-10 rounded-xl shadow-sm border text-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          My Profile
        </h1>
        <p className="text-gray-500 text-sm">
          View your personal and employment details
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border p-6">

        {/* Top Section */}
        <div className="flex items-center gap-6 border-b pb-6">

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {employee.firstName?.charAt(0)}
          </div>

          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {employee.firstName} {employee.lastName}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {employee.designation} • {employee.department}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                employee.employmentStatus === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.employmentStatus}
            </span>
          </div>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-6 mt-6">

          <ProfileField label="Employee Code" value={employee.employeeCode} />
          <ProfileField label="Email" value={employee.email} />

          <ProfileField label="Phone" value={employee.phone || "-"} />
          <ProfileField label="Role" value={employee.role} />

          <ProfileField label="Department" value={employee.department} />
          <ProfileField label="Joining Date" value={employee.joiningDate} />

        </div>

      </div>

    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-gray-800">
      {value || "-"}
    </p>
  </div>
);

export default Profile;