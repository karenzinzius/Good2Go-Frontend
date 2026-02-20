const DashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="opacity-80 text-center max-w-lg">
        Welcome! This is a protected page visible only to logged-in users.
      </p>
    </div>
  )
}

export default DashboardPage
