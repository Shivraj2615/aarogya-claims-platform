import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./StatusPage.css";

const Unauthorized = () => {
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
        <div className="status-code">403</div>

        <h1>Access Denied</h1>

        <p>
          You don't have permission to access this portal with your current
          account.
        </p>

        <button className="status-primary-button" onClick={handleGoBack}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
