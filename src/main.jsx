
  import { hydrateRoot, createRoot } from "react-dom/client";
  import App from "./App.jsx";
  import "./index.css";

  const container = document.getElementById("root");
  if (container.hasChildNodes()) {
    hydrateRoot(container, <App />);
  } else {
    const root = createRoot(container);
    root.render(<App />);
  }
  