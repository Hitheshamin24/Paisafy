import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logolight.png";
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
    <nav className="w-full fixed top-0 z-50 bg-[#f6f7f1d7] backdrop-blur-md text-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          to="#"
          className="flex items-center space-x-3"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logo} alt="Paisafy Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold tracking-wide ml-3">Paisafy</span>
        </Link>

        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <li>
            <a className="hover:text-green-600" href="#">
              Home
            </a>
          </li>
          <li>
            <a className="hover:text-green-600" href="#About">
              About
            </a>
          </li>
          <li>
            <a className="hover:text-green-600" href="#how-it-works">
              How it Works
            </a>
          </li>
          <li>
            <button
              onClick={handleGetStarted}
              className="bg-green-600 text-white border rounded-md border-green-600 px-4 py-1.5 hover:bg-green-700 transition cursor-pointer"
            >
              Get Started
            </button>
          </li>
          <li>
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  className="border border-green-600 px-4 py-1.5 rounded-md cursor-pointer hover:border-green-200"
                  id="#"
                  onClick={() => window.scrollTo(top)}
                >
                  Login / Sign Up
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <UserButton />
              </div>
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
        <div className="md:hidden z-50 bg-[#a0a08c54] backdrop-blur-md shadow-md px-6 pt-4 pb-6 space-y-4 text-sm font-medium">
          <Link
            onClick={() => setIsOpen(false)}
            className="block hover:text-green-900 ml-1"
            to="/"
          >
            Home
          </Link>
          <a
            onClick={() => setIsOpen(false)}
            className="block hover:text-green-900 ml-1"
            href="#about"
          >
            About
          </a>
          <a
            onClick={() => setIsOpen(false)}
            className="block hover:text-green-900 ml-1"
            href="#how-it-works"
          >
            How it Works
          </a>
          <button
            onClick={() => {
              setIsOpen(false);
              handleGetStarted();
            }}
            className="block bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition w-full cursor-pointer text-left"
          >
            Get Started
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="w-full border border-green-600 px-4 py-2 rounded-md hover:border-green-400 text-left cursor-pointer">
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
