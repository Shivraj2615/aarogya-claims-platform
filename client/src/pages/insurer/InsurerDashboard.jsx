import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, getAuthHeaders } from "../../services/api";
import Loading from "../../components/common/Loading";
import Alert from "../../components/common/Alert";
import "./InsurerDashboard.css";

const InsurerDashboard = () => {
  const navigate = useNavigate();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const fetchClaims = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (status) params.append("status", status);
      if (fromDate) params.append("fromDate", fromDate);
      if (toDate) params.append("toDate", toDate);
      if (minAmount) params.append("minAmount", minAmount);
      if (maxAmount) params.append("maxAmount", maxAmount);

      const query = params.toString();

      const response = await api.get(`/claims${query ? `?${query}` : ""}`, {
        headers: getAuthHeaders(),
      });

      setClaims(response.data.claims);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchClaims();
  };

  const clearFilters = () => {
    setStatus("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");

    setTimeout(() => {
      fetchClaims();
    }, 0);
  };

  return (
    <div className="insurer-dashboard">
      <main className="insurer-main">
        <div className="insurer-heading">
          <h1>Claims Dashboard</h1>
          <p>Review and manage submitted insurance claims.</p>
        </div>

        <section className="filters-card">
          <div className="filters-header">
            <h2>Filter Claims</h2>
          </div>

          <form className="filters-form" onSubmit={handleFilter}>
            <div className="filter-field">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="filter-field">
              <label htmlFor="fromDate">From Date</label>

              <input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="toDate">To Date</label>

              <input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="minAmount">Min Amount</label>

              <input
                id="minAmount"
                type="number"
                min="0"
                placeholder="₹ Min"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
            </div>

            <div className="filter-field">
              <label htmlFor="maxAmount">Max Amount</label>

              <input
                id="maxAmount"
                type="number"
                min="0"
                placeholder="₹ Max"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
            </div>

            <button type="submit" className="apply-filter-button">
              Apply
            </button>

            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </form>
        </section>

        <Alert type="error" message={error} />

        <section className="insurer-claims-card">
          <div className="insurer-claims-header">
            <h2>All Claims</h2>

            {!loading && (
              <span className="claim-count">
                {claims.length} {claims.length === 1 ? "claim" : "claims"}
              </span>
            )}
          </div>

          {loading && <Loading message="Loading claims..." />}

          {!loading && !error && claims.length === 0 && (
            <div className="insurer-message">No claims found.</div>
          )}

          {!loading && claims.length > 0 && (
            <div className="insurer-table-wrapper">
              <table className="insurer-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Email</th>
                    <th>Claim Amount</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {claims.map((claim) => (
                    <tr key={claim._id}>
                      <td>{claim.patientId?.name || claim.name}</td>

                      <td>{claim.patientId?.email || claim.email}</td>

                      <td>₹{claim.claimAmount}</td>

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
                        <button
                          className={
                            claim.status === "Pending"
                              ? "review-button"
                              : "view-button"
                          }
                          onClick={() =>
                            navigate(`/insurer/claims/${claim._id}`)
                          }
                        >
                          {claim.status === "Pending" ? "Review" : "View"}
                        </button>
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

export default InsurerDashboard;
