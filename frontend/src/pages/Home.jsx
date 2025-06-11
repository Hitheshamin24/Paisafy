import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Form from "./Form"; // ✅ import your form from pages
import { SignedIn } from "@clerk/clerk-react";
import { useRef } from "react";

const Home = () => {
  const formRef = useRef(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar onGetStartedClick={scrollToForm} /> {/* Button will scroll down */}
      <Hero onGetStartedClick={scrollToForm} />   {/* Optional */}
      <About />
      <HowItWorks />
      <div ref={formRef}>
        <SignedIn>
          <Form />
        </SignedIn>
        {/* SignedOut -> show nothing, so this does it by default */}
      </div>
      <Footer />
    </>
  );
};

export default Home;
