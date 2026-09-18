import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuthHeaders } from "../../services/api";
import Alert from "../../components/common/Alert";
import "./SubmitClaim.css";

const SubmitClaim = () => {
  const navigate = useNavigate();

  const [claimAmount, setClaimAmount] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!document) {
      setError("Please upload a supporting document");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append("claimAmount", claimAmount);
      formData.append("description", description);
      formData.append("document", document);

      await api.post("/claims", formData, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      setSuccess("Claim submitted successfully!");

      setClaimAmount("");
      setDescription("");
      setDocument(null);

      e.target.reset();

      setTimeout(() => {
        navigate("/patient");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-page">
      <main className="submit-main">
        <div className="submit-heading">
          <h1>Submit Insurance Claim</h1>
          <p>
            Provide the details of your medical expense and upload supporting
            documentation.
          </p>
        </div>

        <Alert type="error" message={error} />

        <Alert type="success" message={success} />

        <div className="submit-card">
          <form className="submit-form" onSubmit={handleSubmit}>
            <div className="submit-field">
              <label htmlFor="claimAmount">Claim Amount</label>

              <input
                id="claimAmount"
                type="number"
                min="1"
                value={claimAmount}
                onChange={(e) => setClaimAmount(e.target.value)}
                placeholder="Enter claim amount"
                required
              />

              <span className="field-help">
                Enter the total amount you are claiming.
              </span>
            </div>

            <div className="submit-field">
              <label htmlFor="description">Claim Description</label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the medical expense, treatment, or reason for the claim"
                required
              />
            </div>

            <div className="submit-field">
              <label htmlFor="document">Supporting Document</label>

              <div className="document-upload">
                <input
                  id="document"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setDocument(e.target.files[0])}
                  required
                />

                <div className="document-info">
                  PDF, JPG or PNG • Maximum file size: 5 MB
                </div>
              </div>
            </div>

            <div className="submit-actions">
              <button
                type="button"
                className="back-button"
                onClick={() => navigate("/patient")}
              >
                Back to Dashboard
              </button>

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Claim"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubmitClaim;
