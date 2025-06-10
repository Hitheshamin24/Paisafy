import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logodark.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed h-25 top-0 z-50 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Paisafy Logo" className="h-22 w-auto" />
          <span className="text-xl font-bold tracking-wide">Paisafy</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li><Link className="hover:text-blue-400" to="/">Home</Link></li>
          <li><a className="hover:text-blue-400" href="#About">About</a></li>
          <li><a className="hover:text-blue-400" href="#how-it-works">How it Works</a></li>
          <li>
            <Link className="bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition" to="/form">
              Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/20 backdrop-blur-md shadow-md px-6 pt-4 pb-6 space-y-4 text-sm font-medium">
          <Link onClick={() => setIsOpen(false)} className="block hover:text-blue-400" to="/">Home</Link>
          <a onClick={() => setIsOpen(false)} className="block hover:text-blue-400" href="#about">About</a>
          <a onClick={() => setIsOpen(false)} className="block hover:text-blue-400" href="#how-it-works">How it Works</a>
          <Link onClick={() => setIsOpen(false)} className="block bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition" to="/form">
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
