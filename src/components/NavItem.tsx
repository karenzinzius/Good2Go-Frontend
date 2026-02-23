import { Link } from "react-router-dom";

type NavItemProps = {
  to: string;
  children: React.ReactNode;
};

const NavItem = ({ to, children }: NavItemProps) => {
  return (
    <Link
      to={to}
      className="relative group inline-flex items-center gap-1"
    >
      {children}
      <span className="absolute left-0 -bottom-1 h-[3px] w-0 bg-[#57663b] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

export default NavItem;
