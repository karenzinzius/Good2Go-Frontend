import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";

interface SignupForm {
  username: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

const SignupPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const [form, setForm] = useState<SignupForm>({
    username: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear errors when user starts typing again
    if (e.target.name === "username") {
      setUserError(null);
      setSuggestion(null);
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleApplySuggestion = () => {
    if (suggestion) {
      setForm({ ...form, username: suggestion });
      setSuggestion(null);
      setUserError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim values to avoid "Karen " issues
    const cleanUsername = form.username.trim();
    const cleanEmail = form.email.trim();

    if (form.password !== form.confirmPassword) {
      showToast("Passwords don’t match!", "error");
      return;
    }

    if (cleanEmail !== form.confirmEmail.trim()) {
      showToast("Emails don’t match!", "error");
      return;
    }

    try {
  // 1. Register - This now returns the user object directly (if you updated the backend)
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
    username: cleanUsername,
    email: cleanEmail,
    password: form.password
  }, { withCredentials: true });

  // 2. STOP HERE! Don't call /me or /login. 
  // The backend already set the cookies and gave us the user data.
  
  const userData = res.data.user; 
  
  if (userData) {
    localStorage.setItem("user", JSON.stringify(userData));
    showToast("Account created! Welcome. ✨", "success");
    setTimeout(() => navigate("/"), 1500);
  } else {
    // If for some reason backend didn't send 'user', then we fallback
    showToast("Registered! Please log in.", "success");
    navigate("/login");
  }
    } catch (err: any) {
      if (err.response?.status === 409) {
        // Handle Duplicate Username/Email
        setUserError("This username is already taken.");
        // Generate a simple suggestion: name + random 3 digits
        setSuggestion(`${cleanUsername}${Math.floor(100 + Math.random() * 900)}`);
      } else {
        showToast(err.response?.data?.message || "Registration failed!", "error");
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        {toast && (
          <div className="toast toast-top toast-center z-50">
            <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg`}>
              <span>{toast.msg}</span>
            </div>
          </div>
        )}
        <div className="card shadow-md w-full max-w-md p-8 relative">
          <Link to="/" className="absolute top-4 left-4 text-2xl opacity-70 hover:opacity-100">←</Link>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className={`input input-bordered w-full ${userError ? "input-error" : ""}`}
              />
              {userError && (
                <label className="label">
                  <span className="label-text-alt text-error font-semibold">{userError}</span>
                  {suggestion && (
                    <span 
                      className="label-text-alt link link-primary" 
                      onClick={handleApplySuggestion}
                    >
                      Try <b>{suggestion}</b>?
                    </span>
                  )}
                </label>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required className="input input-bordered w-full" />
            </div>

            {/* Confirm Email */}
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Email</span></label>
              <input type="email" name="confirmEmail" value={form.confirmEmail} onChange={handleChange} required className="input input-bordered w-full" />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required className="input input-bordered w-full" />
            </div>

            {/* Confirm Password */}
            <div className="form-control">
              <label className="label"><span className="label-text">Confirm Password</span></label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className="input input-bordered w-full" />
            </div>

            <button type="submit" className="btn btn-primary mt-4 w-full">Register</button>
          </form>

          <div className="divider my-6">Or continue with</div>
          <div className="flex flex-col gap-3">
            <button className="btn btn-outline btn-primary gap-2" onClick={() => alert("Google login coming soon!")}><FaGoogle /> Google</button>
            <button className="btn btn-outline btn-primary gap-2" onClick={() => alert("Apple login coming soon!")}><FaApple /> Apple</button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SignupPage;