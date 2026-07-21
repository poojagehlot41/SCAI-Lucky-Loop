import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Lottery from "../pages/Lottery";
import Wallet from "../pages/Wallet";
import Referral from "../pages/Referral";
import Admin from "../pages/Admin";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/referral" element={<Referral />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;