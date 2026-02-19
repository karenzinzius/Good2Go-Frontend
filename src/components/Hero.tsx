import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center max-w-2xl">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Reuse what’s already here
          </h1>

          <p className="py-6 opacity-80">
            Share usable items locally fast, free, and without hassle.
          </p>

          <div className="flex justify-center gap-4">
            <Link to="/signup" className="btn btn-primary">
              Get started
            </Link>

            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
