import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// ── Eye toggle icons ──────────────────────────────────────────────────────────
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

// ── Component ─────────────────────────────────────────────────────────────────
const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!user.passwordChanged) {
      navigate("/change-password");
    } else if (user.role === "EMPLOYEE" || user.role === "MANAGER") {
      navigate("/attendance");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter email and password");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("/api/auth/login", { email, password });
      login(res.data);
      toast.success("Login successful");
    } catch (err) {
      toast.error("Invalid email or password");
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
      {/* ── Login card ── */}
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
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-lg
          shadow-2xl overflow-hidden">

          {/* Gold top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A227]/60 to-transparent" />

          <form onSubmit={handleLogin} className="px-7 py-7 space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[10px] font-medium tracking-[0.2em]
                uppercase text-[#666666] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-md text-xs
                  bg-[#0A0A0A] border border-[#2A2A2A] text-[#F8F5EE]
                  placeholder-[#444444]
                  focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30
                  transition-colors duration-150"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-medium tracking-[0.2em]
                uppercase text-[#666666] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pr-9 rounded-md text-xs
                    bg-[#0A0A0A] border border-[#2A2A2A] text-[#F8F5EE]
                    placeholder-[#444444]
                    focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227]/30
                    transition-colors duration-150"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2
                    text-[#444444] hover:text-[#AAAAAA] transition-colors duration-150"
                >
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-md mt-1
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
                  Signing in…
                </span>
              ) : (
                "Sign In"
              )}
            </button>

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

export default Login;
