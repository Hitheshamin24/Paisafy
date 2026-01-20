import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";
import Form from "./Form"; 
import { SignedIn } from "@clerk/clerk-react";
import { useRef } from "react";
import React, { useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import axios from "axios";

const Home = () => {
  const formRef = useRef(null);
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();
  useEffect(() => {
    if (!isSignedIn) return;

    async function saveUser() {
      try {
        const token = await getToken();
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("User saved or already exists");
        console.log(token);
        console.log("Backend response:", res.data);
      } catch (error) {
        console.error("Error saving user:", error);
      }
    }

    saveUser();
  }, [isSignedIn, getToken]);
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar onGetStartedClick={scrollToForm} />{" "}
      {/* Button will scroll down */}
      <Hero onGetStartedClick={scrollToForm} /> {/* Optional */}
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
