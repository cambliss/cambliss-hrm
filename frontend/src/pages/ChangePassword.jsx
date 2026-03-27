import { useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/change-password", {
        email: user.email,
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully");

      const updatedUser = {
        ...user,
        passwordChanged: true,
      };

      login(updatedUser);

      if (user.role === "EMPLOYEE" || user.role === "MANAGER") {
        navigate("/attendance");
      } else {
        navigate("/");
      }

    } catch (err) {
      alert(err.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-lg font-semibold">Change Password</h2>

        <input
          type="password"
          placeholder="Old Password"
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button className="bg-blue-600 text-white w-full py-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;