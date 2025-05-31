import { Link } from "react-router-dom";
import laptopImage from '../assets/laptop.png';

const Home = () => {
  return (
    // Added w-screen here
    <div className="bg-gray-950 text-white min-h-screen w-screen flex items-center justify-center overflow-x-hidden">
      {/* Container for the whole hero section */}
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-7xl"> {/* Added max-w-7xl here for content */}
        {/* Flex container for the two-column layout */}
        <div className="flex flex-col md:flex-row items-center justify-between md:gap-12"> {/* Added md:gap-12 for spacing */}
          {/* Left Column: Text Content */}
          <div className="w-full md:w-1/2 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Invest Smarter with <span className="text-blue-400">AI-Powered</span> Recommendations
            </h1>
            <p className="text-lg md:text-xl text-opacity-80 mb-8 max-w-2xl mx-auto md:mx-0">
              Get personalized investment advice tailored to your financial goals, risk tolerance, and market conditions. Discover the best stocks, ETFs, and SIPs for your portfolio.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link to="/form">
                <button className="bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out text-white text-lg font-semibold">
                  Get Started
                </button>
              </Link>
              <a href="#" className="text-white border border-white px-6 py-3 rounded-md hover:bg-white hover:text-gray-950 transition duration-300 ease-in-out text-lg font-semibold">
                Learn More
              </a>
            </div>
            {/* Feature Icons/Text Section */}
            <div className="mt-16 flex flex-col md:flex-row justify-center md:justify-start space-y-8 md:space-y-0 md:space-x-8">
              <div className="flex items-center space-x-3">
                {/* Placeholder for Data Driven Insights Icon */}
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                </svg>
                <span className="text-lg font-medium">Data Driven Insights</span>
              </div>
              <div className="flex items-center space-x-3">
                {/* Placeholder for Risk Assessment Icon */}
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7.586 9H5a1 1 0 000 2h.414L7.586 12.414a1 1 0 001.414-1.414L10 9.586l.293-.293z" clipRule="evenodd"></path>
                </svg>
                <span className="text-lg font-medium">Risk Assessment</span>
              </div>
              <div className="flex items-center space-x-3">
                {/* Placeholder for Growth Potential Icon */}
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707a1 1 0 00-1.414-1.414L10 9.586l-1.293-1.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 10.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293z" clipRule="evenodd"></path>
                </svg>
                <span className="text-lg font-medium">Growth Potential</span>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <img
              src={laptopImage}
              alt="Laptop displaying financial charts and graphs"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;