import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";

const AppLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <Navbar />

      <main className="app-content">{children}</main>

      <Footer />
    </div>
  );
};

export default AppLayout;
