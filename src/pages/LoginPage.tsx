import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaGoogle, FaApple } from 'react-icons/fa'

interface LoginForm {
  email: string
  password: string
}

const LoginPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Read stored user object
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      alert('No account found. Please sign up first.')
      return
    }

    const userObj = JSON.parse(storedUser)

    if (userObj.email !== form.email) {
      alert('Email does not match our records.')
      return
    }

    // For now, we skip password validation (mock login)
    // Later, backend validation will go here

    // Redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
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
            onClick={() => alert('Google login coming soon!')}
          >
            <FaGoogle /> Continue with Google
          </button>
          <button
            className="btn btn-outline btn-primary flex items-center justify-center gap-2"
            onClick={() => alert('Apple login coming soon!')}
          >
            <FaApple /> Continue with Apple
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
