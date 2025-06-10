// src/components/Footer.jsx
const Footer = () => {
  return (
    <footer className="bg-black/90 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="text-lg font-semibold mb-4">Paisafy</h4>
          <p className="text-gray-400">
            Empowering you to make smarter financial decisions.
          </p>
        </div>
        <div>
          <h5 className="text-md font-semibold mb-2">Resources</h5>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#about" className="hover:text-blue-400">About</a></li>
            <li><a href="#how-it-works" className="hover:text-blue-400">How It Works</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-md font-semibold mb-2">Company</h5>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-md font-semibold mb-2">Contact</h5>
          <p className="text-gray-400">support@paisafy.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-8">
        &copy; 2025 Paisafy. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
