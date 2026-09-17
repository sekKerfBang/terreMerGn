import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: "12px", background: "#14201b", color: "#fff" },
          success: { iconTheme: { primary: "#128a66", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </AuthProvider>
  </BrowserRouter>
);





// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import { AuthProvider } from "./context/AuthContext";
// import "./styles.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <BrowserRouter>
//     <AuthProvider>
//       <App />
//     </AuthProvider>
//   </BrowserRouter>
// );
