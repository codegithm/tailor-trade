import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import OAuthSuccess from "./pages/OAuthSuccess";

createRoot(document.getElementById("root")!).render(<App />);
