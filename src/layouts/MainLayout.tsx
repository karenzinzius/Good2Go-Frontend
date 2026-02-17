import type { ReactNode } from "react"
import TopNav from "../components/TopNav"
import Footer from "../components/Footer"

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="bg-base-200 min-h-screen flex flex-col">
      <TopNav />
      
      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default MainLayout
