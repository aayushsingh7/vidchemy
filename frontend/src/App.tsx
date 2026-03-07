import Home from "./pages/Home";

import { useEffect, useState } from "react";
import SideNav from "./layouts/SideNav";
import DashboardHome from "./pages/dashboard/Home";
import PipelineLoader from "./layouts/PipelineLoader";
import { Routes, Route, Outlet } from "react-router-dom";
import Listings from "./pages/dashboard/Listings";
import Product from "./pages/Product";
import { useGuestAccount } from "./hooks/useGuestAccount";

const App = () => {
  const [status, setStatus] = useState<string>();
  const guestId = useGuestAccount();
  
  const statusState = [
    "PENDING",
    "INGESTING & VERIFYING",
    "QUEUED",
    "PROCESSING",
    "FINALIZING",
    "COMPLETED",
    "FAILED",
    "REJECTED",
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      console.log("hello");
      setStatus(statusState[i]);
      i++;
      if (i == statusState.length) {
        clearInterval(interval);
      }
    }, 2000);
  }, []);
  
  if(!guestId) return null;
  
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <div className="flex">
              <SideNav />
              <Outlet />
            </div>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="listings" element={<Listings />} />
        </Route>

        <Route
          path="/status/:jobId"
          element={<PipelineLoader status={status} />}
        />

        <Route path="/product/:id" element={<Product />} />
      </Routes>
    </div>
  );
};

export default App;
