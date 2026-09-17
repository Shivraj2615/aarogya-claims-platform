import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./StatusPage.css";

const NotFound = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (user?.role === "patient") {
      navigate("/patient");
    } else if (user?.role === "insurer") {
      navigate("/insurer");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="status-page">
      <div className="status-card">
        <div className="status-code">404</div>

        <h1>Page Not Found</h1>

        <p>
          The page you are looking for doesn't exist or may have been moved.
        </p>

        <button className="status-primary-button" onClick={handleGoBack}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
