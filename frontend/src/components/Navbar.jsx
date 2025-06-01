import { Link } from "react-router-dom";
import logo from "../assets/logodark.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsopen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 bg-black/60 backdrop-blur-md text-white shadow-md h-25">
      <div className="max-w-7xl mt-1 mx-auto px-6 py-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center  space-x-12">
          <img
            src={logo}
            alt="Paisafy Logo"
            className="h-75 w-auto  object-contain" // Changed h-16 to h-24
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center justify-between space-x-6 font-medium">
          <li>
            <Link className="hover:text-blue-400" to="/">
              Home
            </Link>
          </li>
          <li>
            <a className="hover:text-blue-400" href="#about">
              About
            </a>
          </li>
          <li>
            <a className="hover:text-blue-400" href="#how-it-works">
              How it Works
            </a>
          </li>
          <li>
            <Link
              className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300"
              to="/form"
            >
              Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsopen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-md px-6 pb-4 space-y-4">
          <a href="/" className="block hover:text-blue-400">
            Home
          </a>
          <a href="#about" className="block hover:text-blue-400">
            About
          </a>
          <a href="#how-it-works" className="block hover:text-blue-400">
            How It Works
          </a>
          <Link
            to="/form"
            className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
