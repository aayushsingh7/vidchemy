import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { GlobalProvider } from "./contexts/globalContext.tsx";
import { SocketProvider } from "./contexts/socketContext.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <GlobalProvider>
          <App />
        </GlobalProvider>
      </SocketProvider>
    </BrowserRouter>
  // </StrictMode>,
);
