import Home from "./pages/Home";
import { Outlet, Route, Routes } from "react-router-dom";
import { useGuestAccount } from "./hooks/useGuestAccount";
import PipelineLoader from "./layouts/PipelineLoader";
import SideNav from "./layouts/SideNav";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Listings from "./pages/dashboard/Listings";
import Listing from "./pages/dashboard/Listing";

const App = () => {
  const guestId = useGuestAccount();
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
          <Route path="listings/:id" element={<Listing/> } />
        </Route>

        <Route
          path="/status/:jobId"
          element={<PipelineLoader />}
        />
      </Routes>
    </div>
  );
};

export default App;
