import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../../components/common/Loading";
import "./Auth.css";

const Login = () => {
  const { user, loading, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

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
      setIsLoggingIn(true);

      const user = await login(email, password);

      if (user.role === "patient") {
        navigate("/patient");
      } else if (user.role === "insurer") {
        navigate("/insurer");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return <Loading message="Loading..." />;
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <h1>Aarogya</h1>
          <p>Claims Management Platform</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={isLoggingIn}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoggingIn}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-demo">
          <p>Use the provided demo credentials to continue.</p>
        </div>

        <div className="auth-footer">
          <span>Don't have an account?</span>
          <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
