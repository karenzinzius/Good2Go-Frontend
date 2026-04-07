import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaGoogle, FaApple } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";
import axios from "axios";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
  msg: string
  type: "success" | "error"
} | null>(null);

 const showToast = (msg: string, type: "success" | "error" = "success") => {
  setToast({ msg, type });
  setTimeout(() => setToast(null), 2500);
};
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Talk to the real backend
    await axios.post(`${import.meta.env.VITE_API_URL}api/auth/login`, form, {withCredentials: true });

    // 2. The backend sends a "Logged in" message, but the cookies stay in the browser.
    // We should fetch the user data using your /me endpoint now.
    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, { withCredentials: true });
    
    // Save user info (but NOT the password/token) for the UI to use
    localStorage.setItem("user", JSON.stringify(userRes.data.user));

    showToast("Welcome back! ✨", "success");
    setTimeout(() => navigate("/"), 1500);

  } catch (err: any) {
    showToast(err.response?.data?.message || "Login failed!", "error");
  }
};

  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      {toast && (
  <div className="toast toast-top toast-center">
    <div
      className={`alert shadow-lg ${
        toast.type === "success" ? "alert-success" : "alert-error"
      }`}
    >
      <span>{toast.msg}</span>
    </div>
  </div>
)}
      <div className="card shadow-md w-full max-w-md p-8 relative">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-4 left-4 text-2xl opacity-70 hover:opacity-100"
          aria-label="Back to home"
        >
          ←
        </Link>

        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4 w-full">
            Login
          </button>
        </form>

        {/* Divider for OAuth */}
        <div className="divider my-6">Or continue with</div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
            onClick={() => showToast("Google login coming soon!")}
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
            onClick={() => alert("Apple login coming soon!")}
          >
            <FaApple /> Continue with Apple
          </button>
        </div>
      </div>
    </div>
    </MainLayout>
  );
};

export default LoginPage;
