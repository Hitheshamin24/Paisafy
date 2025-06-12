import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logodark.png";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";

const Navbar = ({ onGetStartedClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();

  // Function to handle Get Started button
  const handleGetStarted = () => {
    if (isSignedIn) {
      onGetStartedClick(); // Scroll to form
    } else {
      document.getElementById("open-signin")?.click(); // Trigger hidden SignInButton
    }
  };

  return (
    <nav className="w-full fixed top-0 z-50 bg-black/80 backdrop-blur-md text-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center space-x-3">
          <img src={logo} alt="Paisafy Logo" className="h-15 w-auto" />
          <span className="text-xl font-bold tracking-wide ml-3">Paisafy</span>
        </Link>

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
            <button
              onClick={handleGetStarted}
              className="bg-blue-600 border rounded-md border-blue-600 px-4 py-1.5 hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </li>
          <li>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="border border-blue-600 px-4 py-1.5 rounded-md cursor-pointer hover:border-blue-200">
                  Login / Sign Up
                </button>
              </SignInButton>
            </SignedOut>
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

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden z-50 bg-black/10 backdrop-blur-md shadow-md px-6 pt-4 pb-6 space-y-4 text-sm font-medium">
          <Link onClick={() => setIsOpen(false)} className="block hover:text-blue-400 ml-1" to="/">Home</Link>
          <a onClick={() => setIsOpen(false)} className="block hover:text-blue-400 ml-1" href="#about">About</a>
          <a onClick={() => setIsOpen(false)} className="block hover:text-blue-400 ml-1" href="#how-it-works">How it Works</a>
          <button
            onClick={() => {
              setIsOpen(false);
              handleGetStarted();
            }}
            className="block bg-blue-600 px-4 py-2 rounded-md hover:bg-blue-700 transition w-full text-left"
          >
            Get Started
          </button>

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

      {/* Hidden SignInButton used for programmatic trigger */}
      <SignedOut>
        <SignInButton mode="modal">
          <button id="open-signin" className="hidden" />
        </SignInButton>
      </SignedOut>
    </nav>
  );
};

export default Navbar;
