import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getAuthHeaders } from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import "./PatientClaimDetails.css";

const PatientClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await api.get(`/claims/${id}`, {
          headers: getAuthHeaders(),
        });

        setClaim(response.data.claim);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load claim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  if (loading) {
    return <Loading message="Loading claim details..." />;
  }

  if (!claim) {
    return <p>{error || "Claim not found"}</p>;
  }

  const documentUrl = claim.documentUrl;

  const statusClass =
    claim.status === "Pending"
      ? "status-pending"
      : claim.status === "Approved"
        ? "status-approved"
        : "status-rejected";

  return (
    <div className="patient-details-page">
      <main className="patient-details-main">
        <div className="details-heading">
          <h1>Claim Details</h1>
          <p>View the current status and details of your insurance claim.</p>
        </div>

        <Alert type="error" message={error} />

        <div className="claim-details-card">
          <div className="claim-status-header">
            <h2>Claim Status</h2>

            <span className={`status-badge ${statusClass}`}>
              {claim.status}
            </span>
          </div>

          <section className="claim-info-section">
            <h3>Claim Information</h3>

            <div className="claim-info-grid">
              <div className="info-item">
                <span className="info-label">Claim Amount</span>

                <span className="info-value">₹{claim.claimAmount}</span>
              </div>

              <div className="info-item">
                <span className="info-label">Approved Amount</span>

                <span className="info-value">
                  {claim.approvedAmount !== null
                    ? `₹${claim.approvedAmount}`
                    : "-"}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Submitted On</span>

                <span className="info-value">
                  {new Date(claim.submissionDate).toLocaleString()}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Supporting Document</span>

                <a
                  className="document-link"
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Document
                </a>
              </div>

              <div className="info-item full-width">
                <span className="info-label">Description</span>

                <span className="info-value">{claim.description}</span>
              </div>

              <div className="info-item full-width">
                <span className="info-label">Insurer Comments</span>

                <div className="comments-box">
                  {claim.insurerComments || "No comments have been added yet."}
                </div>
              </div>
            </div>
          </section>

          <div className="details-actions">
            <button
              className="back-dashboard-button"
              onClick={() => navigate("/patient")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientClaimDetails;
