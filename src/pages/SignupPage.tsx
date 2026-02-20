import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
}

const SignupPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupForm>({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    localStorage.setItem('user', form.email)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card shadow-md w-full max-w-md p-8">
          {/* Back line */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-2xl opacity-70 hover:opacity-100"
        aria-label="Back to home"
      >
        ←
      </Link>
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

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

          <button type="submit" className="btn btn-primary mt-2 w-full">
            Sign Up
          </button>

        </form>
      </div>
    </div>
  )
}

export default SignupPage
