import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initCourseStorage } from "@/lib/courseStorage";

initCourseStorage();

createRoot(document.getElementById("root")!).render(<App />);
