import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login: store email in localStorage
    localStorage.setItem("user", form.email);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card p-8 shadow-md w-full max-w-md">
      {/* Back line */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-2xl opacity-70 hover:opacity-100"
        aria-label="Back to home"
      >
        ←
      </Link>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
          <button type="submit" className="btn btn-primary mt-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
