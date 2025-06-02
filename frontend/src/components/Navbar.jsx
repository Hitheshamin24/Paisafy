import { Link } from "react-router-dom";
import logo from "../assets/logodark.png";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence

const Navbar = () => {
  const [isOpen, setIsopen] = useState(false);

  // Variants for the main navbar (optional, but good for initial load)
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Variants for the mobile menu
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -50, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto", // Animate height to auto
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren" // Ensures parent animates before children
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Variants for mobile menu items (optional, but nice touch)
  const mobileMenuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };


  return (
    <motion.nav
      className="w-full fixed top-0 z-50 bg-black/60 backdrop-blur-md text-white shadow-md h-25"
      initial="hidden" // Initial state for the main navbar
      animate="visible" // Animate to this state on mount
      variants={navbarVariants} // Apply navbar variants
    >
      <div className="max-w-7xl mt-1 mx-auto px-6 py-4 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-12">
          <img
            src={logo}
            alt="Paisafy Logo"
            className="h-75 w-auto object-contain"
          />
        </Link>

        {/* Desktop Menu - No motion.div needed here if you only animate the parent */}
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
          <button onClick={() => setIsopen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence> {/* Wrap the conditional rendering with AnimatePresence */}
        {isOpen && (
          <motion.div
            className="md:hidden bg-black/90 backdrop-blur-md px-6 pb-4 space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants} // Apply mobile menu variants
          >
            <motion.a href="/" className="block hover:text-blue-400" variants={mobileMenuItemVariants}>
              Home
            </motion.a>
            <motion.a href="#about" className="block hover:text-blue-400" variants={mobileMenuItemVariants}>
              About
            </motion.a>
            <motion.a href="#how-it-works" className="block hover:text-blue-400" variants={mobileMenuItemVariants}>
              How It Works
            </motion.a>
            <motion.a // Using motion.a for consistency with other items, though Link is fine too
              to="/form"
              className="block bg-blue-600 text-white px-4 py-2 rounded-md text-center hover:bg-blue-700 transition"
              variants={mobileMenuItemVariants}
            >
              Get Started
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;