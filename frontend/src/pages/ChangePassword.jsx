import { useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── Eye toggle icons ───────────────────────────────────────────────────────────
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// ── Password field with show/hide toggle ──────────────────────────────────────
const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-[10px] font-medium tracking-[0.2em]
        uppercase text-[#666666] mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2.5 pr-9 rounded-md text-xs
            bg-[#0A0A0A] border border-[#2A2A2A] text-[#F8F5EE]
            placeholder-[#444444]
            focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30
            transition-colors duration-150"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2
            text-[#444444] hover:text-[#AAAAAA] transition-colors duration-150"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const ChangePassword = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/auth/change-password", {
        email: user.email,
        oldPassword,
        newPassword,
      });

      toast.success("Password updated successfully");
      login({ ...user, passwordChanged: true });

      if (user.role === "EMPLOYEE" || user.role === "MANAGER") {
        navigate("/attendance");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        backgroundColor: "#0A0A0A",
        backgroundImage:
          "radial-gradient(ellipse at 60% 20%, rgba(201,162,39,0.07) 0%, transparent 60%)",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="w-full max-w-sm">

        {/* Logo mark */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center
            justify-center mb-4 shadow-lg shadow-[#C9A227]/20">
            <span
              className="text-[#0A0A0A] font-semibold leading-none"
              style={{ fontSize: 13, letterSpacing: "0.05em" }}
            >
              FH
            </span>
          </div>
          <h1
            className="text-2xl font-light text-[#F8F5EE] tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            FLIC HRMS
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#666666] mt-1.5">
            Security update required
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg
          shadow-2xl overflow-hidden">

          {/* Gold top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/60 to-transparent" />

          <div className="px-7 py-6 border-b border-[#1C1C1C]">
            <p className="text-[9px] font-medium tracking-[0.3em] uppercase text-[#C9A227] mb-0.5">
              Account
            </p>
            <h2
              className="text-sm font-medium text-[#F8F5EE]"
              style={{ fontFamily: "'Playfair Display', 'Georgia', serif", fontWeight: 400 }}
            >
              Change Password
            </h2>
            <p className="text-[10px] text-[#555555] mt-1 tracking-wide">
              You must update your password before continuing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">

            <PasswordField
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-md
                  text-[11px] font-semibold tracking-[0.2em] uppercase
                  bg-[#C9A227] hover:bg-[#E6B93A] active:bg-[#9B7A18]
                  text-[#0A0A0A] shadow-md shadow-[#C9A227]/20
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors duration-150"
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <span className="w-3 h-3 rounded-full border-2 border-[#0A0A0A]/30
                      border-t-[#0A0A0A] animate-spin" />
                    Updating…
                  </span>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[9px] tracking-[0.2em] uppercase
          text-[#333333] mt-6">
          © {new Date().getFullYear()} FLIC HRMS. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default ChangePassword;
