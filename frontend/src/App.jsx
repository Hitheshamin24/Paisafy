// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

import Home from "./pages/Home";
import FormPage from "./pages/Form";
import axios from "axios";

function App() {
  const { isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;

    async function saveUser() {
      try {
        const token = await getToken({ template: "session" });
        await axios.post(
          "/api/user",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("User saved or exists in DB");
      } catch (error) {
        console.error("Failed to save user:", error);
      }
    }

    saveUser();
  }, [isSignedIn, getToken]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  );
}

export default App;
