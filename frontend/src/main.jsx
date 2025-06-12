import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const clerkPubKey = "pk_test_cHVyZS1jb3VnYXItNC5jbGVyay5hY2NvdW50cy5kZXYk";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#0f172a70",
          colorText: "#ffffff",
          colorTextSecondary: "#cbd5e1",
          fontFamily: "Inter, sans-serif",

          // input customization
          colorInputBackground: "#1e293b",
          colorInputText: "#ffffff",
          colorInputBorder: "transparent",
          colorInputPlaceholder: "#94a3b8",
        },
        elements: {
          card: "bg-[#0f172a] text-white rounded-2xl shadow-2xl p-6",
          headerTitle: "text-white text-3xl font-semibold",
          headerSubtitle: "text-slate-400 text-sm mt-2",
          formFieldLabel: "text-slate-300 text-sm mb-1",
          formFieldInput:
            "bg-slate-800 text-white rounded-md border-none focus:ring-2 focus:ring-blue-500",
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 transition text-white font-medium rounded-md py-2",
          socialButtonsBlockButton:
            "bg-slate-800 text-white hover:bg-blue-600 border border-slate-600",
          socialButtonsBlockButton__github:
            "bg-black text-white hover:bg-gray-800",
          socialButtonsBlockButton__google:
            "bg-white text-black hover:bg-gray-200",
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
);
