import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logodark.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Navbar = ({onGetStartedClick}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 z-50 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Paisafy Logo" className="h-15 w-auto" />
          <span className="text-xl font-bold tracking-wide ml-3">Paisafy</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
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
            <li>
              <button
                onClick={onGetStartedClick}
                className="bg-blue-600 border rounded-md border-blue-600 px-4 py-1.5 hover:bg-blue-700 transition"
              >
                Get Started
              </button>
            </li>
          </li>

          {/* Show login/signup when signed out */}
          <li>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="border border-blue-600 px-4 py-1.5 rounded-md cursor-pointer hover:border-blue-200">
                  Login / Sign Up
                </button>
              </SignInButton>
            </SignedOut>

            {/* Avatar when signed in */}
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>

        {/* Mobile menu toggle button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden z-50 bg-black/10 backdrop-blur-md shadow-md px-6 pt-4 pb-6 space-y-4 text-sm font-medium">
          <Link
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400 ml-1"
            to="/"
          >
            Home
          </Link>
          <a
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400 ml-1"
            href="#about"
          >
            About
          </a>
          <a
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-400 ml-1"
            href="#how-it-works"
          >
            How it Works
          </a>
          <button
            onClick={() => {
              setIsOpen(false);
              onGetStartedClick();
            }}
            className="block bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition w-full text-left"
          >
            Get Started
          </button>

          {/* Show login/signup button on mobile */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full border border-blue-600 px-4 py-2 rounded-md hover:border-blue-200 text-left">
                Login / Sign Up
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
