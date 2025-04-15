import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
