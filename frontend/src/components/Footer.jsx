import logo from "../assets/logodark.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion

const Footer = () => {

  // Define animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Stagger children by 0.1 seconds
        delayChildren: 0.2,   // Delay the start of children animations
      },
    },
  };

  // Define animation variants for individual items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Start hidden and slightly below
    visible: { opacity: 1, y: 0 },  // Fade in and move to original position
  };

  return (
    <motion.footer
      className="bg-black text-white py-12 px-4 md:px-20"
      initial="hidden" // Initial state for the footer
      whileInView="visible" // Animate to this state when component mounts
      viewport={{once:true,amount:0.5}}
      variants={containerVariants} // Apply the container variants
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo and About */}
        <motion.div className="h-25 mb-6 flex justify-center" variants={itemVariants}> {/* Apply itemVariants */}
          <img src={logo} alt="Paisafy Logo" className="h-65 md:h-65 w-auto object-contain relative bottom-15" />
        </motion.div>

        {/* Product Links */}
        <motion.div className="text-center" variants={itemVariants}> {/* Apply itemVariants */}
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/form" className="hover:text-white">Get Started</Link></li>
            <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
            <li><a href="#about" className="hover:text-white">About Us</a></li>
          </ul>
        </motion.div>

        {/* Resources */}
        <motion.div className="text-center" variants={itemVariants}> {/* Apply itemVariants */}
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
          </ul>
        </motion.div>

        {/* Contact */}
        <motion.div className="text-center" variants={itemVariants}> {/* Apply itemVariants */}
          <h4 className="font-semibold mb-3">Contact</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Email: support@paisafy.in</li>
            <li>Phone: +91 98765 43210</li>
            <li>Address: Mangalore, India</li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="mt-10 text-center text-sm text-gray-500" variants={itemVariants}> {/* Apply itemVariants */}
        © {new Date().getFullYear()} Paisafy. All rights reserved.
      </motion.div>
    </motion.footer>
  );
};

export default Footer;