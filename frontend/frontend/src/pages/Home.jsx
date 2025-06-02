import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import AboutnAndHow from "../components/AboutnAndHow";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutnAndHow />
      <Footer/>
    </div>
  );
};

export default Home;
