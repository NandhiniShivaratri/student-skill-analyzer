import { useCallback, useEffect, useState } from "react";
import api from "./api";
import "./Certificates.css";

function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [skills, setSkills] = useState([]);
  const [studentName] = useState(
    () => localStorage.getItem("studentName") || "Student"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  const loadCertificates = useCallback(async () => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("token");

    if (!studentId || !token) {
      setError("Please log in to view your certificates.");
      setLoading(false);
      return;
    }

    try {
      setError("");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [certificateResponse, skillResponse] = await Promise.all([
        api.get(`/certificates/student/${studentId}`, config),
        api.get("/skills", config),
      ]);

      const certificateList = Array.isArray(certificateResponse.data)
        ? certificateResponse.data
        : [];

      setCertificates(certificateList);
      setSkills(
        Array.isArray(skillResponse.data) ? skillResponse.data : []
      );

      setSelectedCertificate((previous) => {
        if (!previous) return null;

        return (
          certificateList.find(
            (certificate) =>
              Number(certificate.id) === Number(previous.id)
          ) || null
        );
      });
    } catch (err) {
      console.error("Unable to load certificates:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load certificates. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCertificates();

    const handleCertificatesUpdated = () => {
      loadCertificates();
    };

    window.addEventListener(
      "certificates-updated",
      handleCertificatesUpdated
    );

    return () => {
      window.removeEventListener(
        "certificates-updated",
        handleCertificatesUpdated
      );
    };
  }, [loadCertificates]);

  const getSkillName = (skillId) => {
    const skill = skills.find(
      (item) => Number(item.id) === Number(skillId)
    );

    return skill?.name || `Skill ${skillId}`;
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="certificates-page">
        <h2>My Certificates 🏆</h2>
        <p>Loading your certificates...</p>
      </div>
    );
  }

  return (
    <div className="certificates-page">
      <div className="certificates-heading">
        <div>
          <h2>My Certificates 🏆</h2>
          <p>
            View your achievements and open your certificates whenever you
            need them.
          </p>
        </div>

        <span className="certificate-count">
          {certificates.length}{" "}
          {certificates.length === 1 ? "Certificate" : "Certificates"}
        </span>
      </div>

      {error && <div className="certificate-error">{error}</div>}

      {!error && certificates.length === 0 && (
        <div className="certificate-empty">
          <div className="empty-trophy">🏆</div>
          <h3>No certificates yet</h3>
          <p>
            Pass an assessment and reach the required skill level to earn
            a certificate of completion.
          </p>
        </div>
      )}

      <div className="certificate-grid">
        {certificates.map((certificate) => (
          <article className="certificate-preview" key={certificate.id}>
            <div className="preview-top">
              <span className="preview-logo">S</span>
              <span className="preview-label">CERTIFICATE</span>
            </div>

            <div className="preview-content">
              <p className="preview-overline">SKILLTRACK ACHIEVEMENT</p>
              <h3>Certificate of Completion</h3>
              <div className="preview-line" />

              <p className="preview-student">{studentName || "Student"}</p>

              <p className="preview-skill">
                {getSkillName(certificate.skillId)}
              </p>

              <div className="preview-seal">✓</div>
            </div>

            <div className="preview-bottom">
              <span>No. {certificate.certificateNumber}</span>

              <button
                type="button"
                className="view-certificate-button"
                onClick={() => setSelectedCertificate(certificate)}
              >
                View Certificate ↗
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedCertificate && (
        <div
          className="certificate-modal"
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="certificate-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-toolbar no-print">
              <button
                type="button"
                className="close-certificate-button"
                onClick={() => setSelectedCertificate(null)}
              >
                ✕ Close
              </button>

              <button
                type="button"
                className="print-certificate-button"
                onClick={handlePrint}
              >
                🖨 Print / Save PDF
              </button>
            </div>

            <div className="full-certificate">
              <div className="certificate-border">
                <div className="full-certificate-header">
                  <div className="full-certificate-logo">S</div>
                  <p>SKILLTRACK · STUDENT SKILL GAP ANALYZER</p>
                  <div className="gold-line" />
                </div>

                <p className="certificate-kicker">
                  CERTIFICATE OF ACHIEVEMENT
                </p>

                <h1>Certificate of Completion</h1>

                <p className="certificate-presented">
                  This certificate is proudly presented to
                </p>

                <h2 className="certificate-recipient">
                  {studentName || "Student"}
                </h2>

                <div className="recipient-underline" />

                <p className="certificate-description">
                  for successfully reaching the required skill level in
                </p>

                <h2 className="certificate-skill-name">
                  {getSkillName(selectedCertificate.skillId)}
                </h2>

                <p className="certificate-description">
                  and demonstrating achievement in the selected skill.
                </p>

                <div className="certificate-level-details">
                  <div>
                    <span>Verified Level</span>
                    <strong>
                      {selectedCertificate.verifiedLevel}/10
                    </strong>
                  </div>

                  <div>
                    <span>Required Level</span>
                    <strong>
                      {selectedCertificate.requiredLevel}/10
                    </strong>
                  </div>
                </div>

                <div className="certificate-seal-large">
                  <span>✓</span>
                  <small>COMPLETED</small>
                </div>

                <div className="full-certificate-footer">
                  <div className="certificate-signature">
                    <div className="signature-line" />
                    <strong>SkillTrack</strong>
                    <span>Learning Platform</span>
                  </div>

                  <div className="certificate-date">
                    <strong>
                      {selectedCertificate.issueDate
                        ? new Date(
                            `${selectedCertificate.issueDate}T00:00:00`
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </strong>
                    <div className="signature-line" />
                    <span>Date of Issue</span>
                  </div>
                </div>

                <p className="certificate-number">
                  Certificate Number: {selectedCertificate.certificateNumber}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificates;