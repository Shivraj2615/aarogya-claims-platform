import Navbar from "./Navbar";
import Footer from "./Footer";

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
