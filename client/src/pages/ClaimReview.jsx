import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getAuthHeaders, API_BASE_URL } from "../services/api";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import "./ClaimReview.css";

const ClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [claim, setClaim] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [approvedAmount, setApprovedAmount] = useState("");
  const [insurerComments, setInsurerComments] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await api.get(`/claims/${id}`, {
          headers: getAuthHeaders(),
        });

        const data = response.data.claim;

        setClaim(data);
        setStatus(data.status);
        setApprovedAmount(data.approvedAmount ?? "");
        setInsurerComments(data.insurerComments || "");
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load claim");
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (claim.status !== "Pending") {
      return;
    }

    if (status === "Approved" && approvedAmount === "") {
      setError("Approved amount is required");
      return;
    }

    if (status === "Approved" && Number(approvedAmount) > claim.claimAmount) {
      setError("Approved amount cannot exceed claim amount");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/claims/${id}`,
        {
          status,
          approvedAmount: approvedAmount === "" ? null : Number(approvedAmount),
          insurerComments,
        },
        {
          headers: getAuthHeaders(),
        },
      );

      setClaim(response.data.claim);
      setSuccess("Claim updated successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update claim");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading message="Loading claim details..." />;
  }

  if (!claim) {
    return <p>{error || "Claim not found"}</p>;
  }

  const documentUrl = `${API_BASE_URL}${claim.documentUrl}`;
  const isDecided = claim.status !== "Pending";

  return (
    <div className="claim-review-page">
      <main className="claim-review-main">
        <div className="review-heading">
          <h1>Claim Review</h1>
          <p>Review claim information and make a decision.</p>
        </div>

        <Alert type="error" message={error} />

        <Alert type="success" message={success} />

        {isDecided && (
          <div
            className={`decision-banner ${
              claim.status === "Approved" ? "approved" : "rejected"
            }`}
          >
            This claim has already been{" "}
            <strong>{claim.status.toLowerCase()}</strong>. The review details
            are read-only.
          </div>
        )}

        <section className="review-card">
          <div className="review-card-header">
            <h2>Claim Information</h2>
          </div>

          <div className="review-card-body">
            <div className="review-info-grid">
              <div className="review-info-item">
                <span className="review-info-label">Patient</span>

                <span className="review-info-value">
                  {claim.patientId?.name || claim.name}
                </span>
              </div>

              <div className="review-info-item">
                <span className="review-info-label">Email</span>

                <span className="review-info-value">
                  {claim.patientId?.email || claim.email}
                </span>
              </div>

              <div className="review-info-item">
                <span className="review-info-label">Claim Amount</span>

                <span className="review-info-value">₹{claim.claimAmount}</span>
              </div>

              <div className="review-info-item">
                <span className="review-info-label">Submitted</span>

                <span className="review-info-value">
                  {new Date(claim.submissionDate).toLocaleString()}
                </span>
              </div>

              <div className="review-info-item full-width">
                <span className="review-info-label">Description</span>

                <span className="review-info-value">{claim.description}</span>
              </div>

              <div className="review-info-item">
                <span className="review-info-label">Current Status</span>

                <span className="review-info-value">{claim.status}</span>
              </div>

              <div className="review-info-item">
                <span className="review-info-label">Supporting Document</span>

                <a
                  className="document-button"
                  href={documentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Document
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="review-card">
          <div className="review-card-header">
            <h2>{isDecided ? "Decision Details" : "Make a Decision"}</h2>
          </div>

          <div className="review-card-body">
            <form className="review-form" onSubmit={handleUpdate}>
              <div className="review-field">
                <label htmlFor="review-status">Status</label>

                <select
                  id="review-status"
                  value={status}
                  disabled={isDecided}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Pending">Pending</option>

                  <option value="Approved">Approved</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="review-field">
                <label htmlFor="approved-amount">Approved Amount</label>

                <input
                  id="approved-amount"
                  type="number"
                  min="0"
                  max={claim.claimAmount}
                  value={approvedAmount}
                  disabled={isDecided}
                  onChange={(e) => setApprovedAmount(e.target.value)}
                  placeholder="Enter approved amount"
                />

                <span className="review-help">
                  Required when approving a claim.
                </span>
              </div>

              <div className="review-field">
                <label htmlFor="insurer-comments">Insurer Comments</label>

                <textarea
                  id="insurer-comments"
                  value={insurerComments}
                  disabled={isDecided}
                  onChange={(e) => setInsurerComments(e.target.value)}
                  placeholder="Add comments about the decision..."
                />
              </div>

              <div className="review-actions">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate("/insurer")}
                >
                  Back to Claims
                </button>

                {!isDecided && (
                  <button
                    type="submit"
                    className="update-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Update Claim"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ClaimReview;
