const Footer = () => {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <p className="font-medium">
        Built for reuse, community, and sustainability.
      </p>
      <p className="text-sm opacity-70">
        © {new Date().getFullYear()} good2go
      </p>
    </footer>
  )
}

export default Footer
