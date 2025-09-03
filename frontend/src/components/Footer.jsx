// Enhanced Footer Component with Tailwind CSS
import logo from "../assets/logodark.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 py-16 px-4 border-t border-green-500/20 shadow-2xl shadow-green-500/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
        
        {/* Logo + Tagline */}
        <div className="group">
          <div className="relative">
            <img 
              src={logo} 
              alt="Paisafy Logo" 
              className="h-14 w-auto mb-4 brightness-110 contrast-105 hover:brightness-125 hover:scale-105 transition-all duration-300" 
            />
            <div className="absolute -inset-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            Empowering you to make smarter financial decisions.
          </p>
        </div>

        {/* Resources */}
        <div className="group">
          <h5 className="text-md font-semibold mb-3 text-green-400 uppercase tracking-wider relative pb-2">
            Resources
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
          </h5>
          <ul className="space-y-3">
            <li className="relative">
              <a 
                href="#About" 
                className="hover:text-green-300 transition-all duration-300 hover:translate-x-2 inline-block relative group/link"
              >
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-green-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">▸</span>
                About
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
              </a>
            </li>
            <li className="relative">
              <a 
                href="#how-it-works" 
                className="hover:text-green-300 transition-all duration-300 hover:translate-x-2 inline-block relative group/link"
              >
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-green-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">▸</span>
                How It Works
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="group">
          <h5 className="text-md font-semibold mb-3 text-green-400 uppercase tracking-wider relative pb-2">
            Company
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
          </h5>
          <ul className="space-y-3">
            <li className="relative">
              <a 
                href="#" 
                className="hover:text-green-300 transition-all duration-300 hover:translate-x-2 inline-block relative group/link"
              >
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-green-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">▸</span>
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
              </a>
            </li>
            <li className="relative">
              <a 
                href="#" 
                className="hover:text-green-300 transition-all duration-300 hover:translate-x-2 inline-block relative group/link"
              >
                <span className="absolute -left-4 top-1/2 -translate-y-1/2 text-green-400 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">▸</span>
                Terms of Service
                <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-green-400 to-green-500 group-hover/link:w-full transition-all duration-300"></span>
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="group">
          <h5 className="text-md font-semibold mb-3 text-green-400 uppercase tracking-wider relative pb-2">
            Contact
            <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full"></span>
          </h5>
          <div className="inline-block">
            <p className="text-gray-400 hover:text-green-300 cursor-pointer transition-all duration-300 px-3 py-2 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 hover:border-green-500/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20">
              support@paisafy.com
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative mt-12 pt-6 text-center text-gray-500 text-xs">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px bg-gradient-to-r from-green-400 to-green-500 rounded-full"></div>
        <div className="border-t border-green-500/20 pt-6">
          &copy; {new Date().getFullYear()} Paisafy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;