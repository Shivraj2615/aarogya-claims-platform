import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import "./Login.css";

const Login = () => {
  const { user, loading, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "patient") {
      navigate("/patient", { replace: true });
    } else if (user?.role === "insurer") {
      navigate("/insurer", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const user = await login(email, password);

      if (user.role === "patient") {
        navigate("/patient");
      } else if (user.role === "insurer") {
        navigate("/insurer");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  if (loading) {
    return <Loading message="Loading..." />;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Aarogya</h1>
          <p>Claims Management Platform</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        <div className="login-demo">
          <p>Use the provided demo credentials to continue.</p>
        </div>

        <div className="login-register">
          <span>Don't have an account?</span>

          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
