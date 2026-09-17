import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLogoClick = () => {
    if (user?.role === "patient") {
      navigate("/patient");
    } else if (user?.role === "insurer") {
      navigate("/insurer");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={handleLogoClick}>
        Aarogya
      </div>

      <div className="navbar-right">
        {user && (
          <>
            <div className="navbar-user">
              <span className="navbar-user-name">{user.name}</span>

              <span className="navbar-user-role">
                {user.role === "patient" ? "Patient" : "Insurer"}
              </span>
            </div>

            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
