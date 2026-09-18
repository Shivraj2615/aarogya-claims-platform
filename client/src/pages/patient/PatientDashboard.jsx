import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuthHeaders } from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import "./PatientDashboard.css";

const PatientDashboard = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await api.get("/claims/my", {
          headers: getAuthHeaders(),
        });

        setClaims(response.data.claims);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) {
    return <Loading message="Loading your claims..." />;
  }

  const totalClaims = claims.length;
  const pendingClaims = claims.filter(
    (claim) => claim.status === "Pending",
  ).length;
  const approvedClaims = claims.filter(
    (claim) => claim.status === "Approved",
  ).length;

  return (
    <div className="patient-dashboard">
      <main className="patient-main">
        <div className="patient-welcome">
          <div>
            <h2>My Claims</h2>
            <p>Track and manage your insurance claims.</p>
          </div>

          <button
            className="primary-button"
            onClick={() => navigate("/patient/claims/new")}
          >
            + Submit New Claim
          </button>
        </div>

        <Alert type="error" message={error} />

        <section className="claim-summary">
          <div className="summary-card">
            <p>Total Claims</p>
            <h3>{totalClaims}</h3>
          </div>

          <div className="summary-card">
            <p>Pending</p>
            <h3>{pendingClaims}</h3>
          </div>

          <div className="summary-card">
            <p>Approved</p>
            <h3>{approvedClaims}</h3>
          </div>
        </section>

        <section className="claims-section">
          <div className="claims-section-header">
            <h2>Claim History</h2>
          </div>

          {claims.length === 0 ? (
            <div className="empty-claims">
              <h3>No claims submitted yet</h3>
              <p>Submit your first insurance claim to get started.</p>
            </div>
          ) : (
            <div className="claim-table-wrapper">
              <table className="claim-table">
                <thead>
                  <tr>
                    <th>Claim Amount</th>
                    <th>Status</th>
                    <th>Submission Date</th>
                    <th>Approved Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim._id}>
                      <td>
                        <button
                          className="claim-link"
                          onClick={() =>
                            navigate(`/patient/claims/${claim._id}`)
                          }
                        >
                          ₹{claim.claimAmount}
                        </button>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            claim.status === "Pending"
                              ? "status-pending"
                              : claim.status === "Approved"
                                ? "status-approved"
                                : "status-rejected"
                          }`}
                        >
                          {claim.status}
                        </span>
                      </td>

                      <td>
                        {new Date(claim.submissionDate).toLocaleDateString()}
                      </td>

                      <td>
                        {claim.approvedAmount !== null
                          ? `₹${claim.approvedAmount}`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PatientDashboard;
