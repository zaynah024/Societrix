import React from 'react'; // Add this line at the top
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

document.title = "Societrix - Campus Society Management";
const meta = document.createElement('meta');
meta.name = 'description';
meta.content = 'Societrix is a campus society management platform for organizing events, booking venues, and communicating with society members.';
document.head.appendChild(meta);

createRoot(rootElement).render(<App />);