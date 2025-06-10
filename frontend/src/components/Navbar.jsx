import { Link } from "react-router-dom";
import logo from "../assets/logodark.png";

const Navbar = () => {
  return (
    <nav className="w-full fixed top-0 z-50 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-12">
          <img
            src={logo}
            alt="Paisafy Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-xl font-bold tracking-wide">Paisafy</span>
        </Link>

        {/* Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li>
            <Link className="hover:text-blue-400" to="/">Home</Link>
          </li>
          <li>
            <a className="hover:text-blue-400" href="#about">About</a>
          </li>
          <li>
            <a className="hover:text-blue-400" href="#how-it-works">How it Works</a>
          </li>
          <li>
            <Link
              className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition"
              to="/form"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
