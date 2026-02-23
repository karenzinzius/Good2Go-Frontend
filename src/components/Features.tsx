const Features = () => {
  return (
    <section className="py-20 px-6 lg:px-10 bg-base-100">
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Post in seconds</h3>
            <p>
              Take a photo, add a short description,
              and set a pickup location.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">Find nearby items</h3>
            <p>
              See usable furniture, electronics,
              and household items around you.
            </p>
          </div>
        </div>

        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h3 className="card-title">No waste, no selling</h3>
            <p>
              No prices, no negotiations —
              just reuse instead of throwing away.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Features
