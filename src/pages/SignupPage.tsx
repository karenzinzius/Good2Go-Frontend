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
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type});
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // 1. Frontend Validation (Stop here if details are wrong)
  if (form.password !== form.confirmPassword) {
    showToast("Passwords don’t match!", "error");
    return;
  }

  if (form.email !== form.confirmEmail) {
    showToast("Emails don’t match!", "error");
    return;
  }

  try {
    // 2. Register the user
    await axios.post("http://localhost:4000/api/auth/register", {
      username: form.username,
      email: form.email,
      password: form.password
    });

    // 3. Login automatically to get the cookies
    await axios.post("http://localhost:4000/api/auth/login", {
      email: form.email,
      password: form.password
    }, { withCredentials: true });

    // 4. Fetch the full User object (including MongoDB _id)
    const userRes = await axios.get("http://localhost:4000/api/auth/me", { withCredentials: true });
    
    // 5. Store user info and redirect
    localStorage.setItem("user", JSON.stringify(userRes.data.user));
    showToast("Account created! Welcome. ✨", "success");
    
    setTimeout(() => navigate("/"), 1500);
  } catch (err: any) {
    showToast(err.response?.data?.message || "Registration failed!", "error");
  }
};

  return (
    <MainLayout>
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      {toast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success shadow-lg">
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

        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Your username"
              value={form.username}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Email */}
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

          {/* Repeat Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Email</span>
            </label>
            <input
              type="email"
              name="confirmEmail"
              placeholder="Confirm your email"
              value={form.confirmEmail}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Password */}
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

          {/* Confirm Password */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className="input input-bordered w-full"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary mt-4 w-full">
            Register
          </button>
        </form>

        {/* Divider for OAuth */}
        <div className="divider my-6">Or continue with</div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3">
          <button
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
            onClick={() => alert("Google login coming soon!")}
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

export default SignupPage;
