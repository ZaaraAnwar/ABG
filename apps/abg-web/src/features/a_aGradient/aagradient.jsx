import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import {
  getHistory,
  addPatientRecord,
  updatePatientRecord,
  deleteAllHistory,
} from "./historyStorage";

function Aagradient() {
  const [fiO2, setFiO2] = useState(21);
  const [paCO2, setPaCO2] = useState(40);
  const [paO2, setPaO2] = useState(100);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [view, setView] = useState("calculator"); // 'calculator' | 'history'
  const [historyData, setHistoryData] = useState([]);

  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [patientIdInput, setPatientIdInput] = useState("");
  const [patientNameInput, setPatientNameInput] = useState("");

  useEffect(() => {
    if (view === "history") {
      setHistoryData(getHistory());
    }
  }, [view]);

  const calcAaGradient = () => ((fiO2 / 100) * (760 - 47) - paO2).toFixed(2);
  const calcPao2Fio2 = () => (paO2 / (fiO2 / 100)).toFixed(2);

  const handleAddSubmit = () => {
    if (!patientIdInput.trim() || !patientNameInput.trim()) {
      alert("Please enter both Patient ID and Name.");
      return;
    }
    const currentResult = {
      aaGradient: Number(calcAaGradient()),
      pao2: paO2,
      paco2: paCO2,
      fio2: fiO2 / 100,
      pao2Fio2: Number(calcPao2Fio2()),
    };
    const success = addPatientRecord(
      patientIdInput,
      patientNameInput,
      currentResult,
    );
    if (!success) {
      alert("Patient ID already exists. Use Update instead.");
    } else {
      setShowAddModal(false);
      setPatientIdInput("");
      setPatientNameInput("");
      alert("Saved successfully!");
    }
  };

  const handleUpdateSubmit = () => {
    if (!patientIdInput.trim()) {
      alert("Please enter a Patient ID.");
      return;
    }
    const currentResult = {
      aaGradient: Number(calcAaGradient()),
      pao2: paO2,
      paco2: paCO2,
      fio2: fiO2 / 100,
      pao2Fio2: Number(calcPao2Fio2()),
    };
    const success = updatePatientRecord(patientIdInput, currentResult);
    if (!success) {
      alert("Patient ID not found.");
    } else {
      setShowUpdateModal(false);
      setPatientIdInput("");
      setPatientNameInput("");
      alert("Updated successfully!");
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      deleteAllHistory();
      setHistoryData([]);
    }
  };

  // Header Component
  const TopBar = () => (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff", // Dark blue background
        color: "#a3e635",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1rem",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
        }}
        onClick={() => setView("calculator")}
      >
        {view === "history" && (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        )}

        {view === "history" && (
          <h1
            style={{
              fontSize: "1.25rem",
              margin: 0,
              fontWeight: "normal",
              color: "#a3e635",
            }}
          >
            History
          </h1>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        {view === "calculator" && (
          <>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
            <button
              onClick={() => setShowSaveMenu(true)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </button>
            <button
              onClick={() => setView("history")}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10"></polyline>
                <polyline points="23 20 23 14 17 14"></polyline>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
              </svg>
            </button>
          </>
        )}
        {view === "history" && (
          <button
            onClick={handleDeleteAll}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  const Modals = () => (
    <>
      {/* Save Action Sheet */}
      {showSaveMenu && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingBottom: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              margin: "0 1rem 0.5rem 1rem",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                fontSize: "0.875rem",
                color: "#6b7280",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              Save Result
            </div>
            <button
              onClick={() => {
                setShowSaveMenu(false);
                setShowAddModal(true);
                setPatientIdInput("");
                setPatientNameInput("");
              }}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "white",
                border: "none",
                borderBottom: "1px solid #e5e7eb",
                color: "#3b82f6",
                fontSize: "1.125rem",
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowSaveMenu(false);
                setShowUpdateModal(true);
                setPatientIdInput("");
              }}
              style={{
                width: "100%",
                padding: "1rem",
                backgroundColor: "white",
                border: "none",
                color: "#3b82f6",
                fontSize: "1.125rem",
                cursor: "pointer",
              }}
            >
              Update
            </button>
          </div>
          <button
            onClick={() => setShowSaveMenu(false)}
            style={{
              margin: "0 1rem",
              padding: "1rem",
              backgroundColor: "white",
              borderRadius: "0.75rem",
              border: "none",
              color: "#3b82f6",
              fontSize: "1.125rem",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              width: "80%",
              maxWidth: "300px",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                fontSize: "1.125rem",
                fontWeight: "bold",
                borderBottom: "1px solid #d1d5db",
              }}
            >
              Enter Patient details
            </div>
            <div style={{ padding: "1rem", backgroundColor: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ width: "80px", fontSize: "0.875rem" }}>
                  Patient ID
                </span>
                <input
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: "80px", fontSize: "0.875rem" }}>
                  Name
                </span>
                <input
                  value={patientNameInput}
                  onChange={(e) => setPatientNameInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #d1d5db" }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  borderRight: "1px solid #d1d5db",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#f3f4f6",
              width: "80%",
              maxWidth: "300px",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                fontSize: "1.125rem",
                fontWeight: "bold",
                borderBottom: "1px solid #d1d5db",
              }}
            >
              Select Patient ID
            </div>
            <div style={{ padding: "1rem", backgroundColor: "white" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ width: "80px", fontSize: "0.875rem" }}>
                  Patient ID
                </span>
                <input
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ width: "80px", fontSize: "0.875rem" }}>
                  Name
                </span>
                <input
                  disabled
                  placeholder="Auto-filled"
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.25rem",
                    backgroundColor: "#f9fafb",
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", borderTop: "1px solid #d1d5db" }}>
              <button
                onClick={() => setShowUpdateModal(false)}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  borderRight: "1px solid #d1d5db",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  border: "none",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  color: "#3b82f6",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const HistoryView = () => (
    <div
      style={{
        padding: "0",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      {historyData.length === 0 ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
          No history records found.
        </div>
      ) : (
        historyData.map((patient) => (
          <div
            key={patient.id}
            style={{ marginBottom: "0.5rem", backgroundColor: "white" }}
          >
            <div
              style={{
                padding: "0.5rem 1rem",
                display: "flex",
                justifyContent: "space-between",
                backgroundColor: "#f3f4f6",
                fontSize: "0.875rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <span style={{ color: "#374151", fontSize: "1rem" }}>
                {patient.name} ({patient.patientId})
              </span>
              <span style={{ color: "#4b5563" }}>
                Date: {patient.results[patient.results.length - 1]?.date}
              </span>
            </div>
            {patient.results
              .slice()
              .reverse()
              .map((res, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    padding: "0.5rem 0",
                    display: "flex",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      A/a Result
                    </div>
                    <div style={{ fontSize: "1.25rem", color: "#16a34a" }}>
                      {res.aaGradient}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "#4b5563" }}>
                      PAO<sub>2</sub> / FiO<sub>2</sub>
                    </div>
                    <div style={{ fontSize: "1rem", color: "black" }}>
                      {res.pao2} / {res.fio2}
                    </div>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      textAlign: "center",
                      borderRight: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", color: "#4b5563" }}>
                      PaCO<sub>2</sub>
                    </div>
                    <div style={{ fontSize: "1rem", color: "black" }}>
                      {res.paco2}
                    </div>
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ fontSize: "0.75rem", color: "#4b5563" }}>
                      PaO<sub>2</sub>
                    </div>
                    <div style={{ fontSize: "1rem", color: "black" }}>
                      {res.pao2}
                    </div>
                  </div>
                </div>
              ))}

            {patient.results.length > 0 && (
              <div style={{ padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
                <div
                  style={{
                    height: "200px",
                    width: "100%",
                    maxWidth: "400px",
                    margin: "0 auto",
                    background: "linear-gradient(to bottom, #e0f2fe, #f0f9ff)",
                    borderLeft: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={patient.results.map((r, idx) => ({
                        time: idx * 5,
                        gradient: r.aaGradient,
                      }))}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#cbd5e1"
                      />
                      <XAxis
                        dataKey="time"
                        type="number"
                        domain={[0, "dataMax"]}
                        tickCount={6}
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis domain={[0, 700]} tick={{ fontSize: 10 }} />
                      <Line
                        type="monotone"
                        dataKey="gradient"
                        stroke="black"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        dot={{ r: 2, fill: "black" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    marginTop: "0.25rem",
                    color: "#4b5563",
                  }}
                >
                  Time(Sec)
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .custom-slider {
          -webkit-appearance: none;
          appearance: none;
        }
        .custom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 1.5rem;
          height: 1.5rem;
          background: white;
          border-radius: 9999px;
          border: 2px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          cursor: pointer;
        }
        .custom-slider::-moz-range-thumb {
          width: 1.5rem;
          height: 1.5rem;
          background: white;
          border-radius: 9999px;
          border: 2px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          cursor: pointer;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "sans-serif",
          color: "#1f2937",
        }}
      >
        <TopBar />
        <Modals />

        {view === "history" ? (
          <HistoryView />
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "90rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              padding: "2rem 1rem",
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            {/* Left Side: Image with Overlay Controls */}
            <div
              style={{
                width: "100%",
                flex: "1 1 300px",
                maxWidth: "28rem",
                position: "relative",
              }}
            >
              <img
                src="https://abg.leadows.com/wp-content/uploads/2026/04/Untitled-Project-3.jpg"
                alt="Circulation Diagram"
                style={{ width: "100%", height: "auto", objectFit: "contain" }}
              />

              {/* Controls overlaying the diagram */}
              <div
                style={{
                  position: "absolute",
                  top: "65%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  zIndex: 10,
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  FiO2%
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <button
                    onClick={() => setFiO2((f) => Math.max(0, f - 1))}
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      width: "1.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#5a5a5a",
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: "bold",
                      width: "2rem",
                      textAlign: "center",
                    }}
                  >
                    {fiO2}
                  </span>
                  <button
                    onClick={() => setFiO2((f) => f + 1)}
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: "bold",
                      width: "1.5rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#5a5a5a",
                    }}
                  >
                    +
                  </button>
                </div>
                <div
                  style={{
                    fontSize: "0.75rem", 
                    fontWeight: "bold",
                    color: "#6b7280",
                    marginTop: "0.25rem",
                  }}
                >
                  PAO2
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                  {((fiO2 / 100) * (760 - 47) - paCO2 / 0.8).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Middle Side: Sliders adjacent to the image */}
            <div
              style={{
                width: "100%",
                flex: "2 1 520px",
                maxWidth: "42rem",
                paddingTop: "7rem",
              }}
            >
              <div
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  boxShadow: "none",
                  padding: 0,
                }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#111827",
                    margin: "0 0 0.25rem 0",
                    textAlign: "center",
                  }}
                >
                  A/a Gradient
                </h2>

                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#111827",
                    margin: "0 0 5rem 0",
                    textAlign: "center",
                    lineHeight: 1.3,
                  }}
                >
                  Values reflect{" "}
                  <span style={{ fontWeight: "bold" }}>
                    Physiological
                    <br />
                    incompatibility.
                  </span>
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "row" : "column",
                    justifyContent: "space-around",
                    alignItems: isMobile ? "flex-start" : "stretch",
                  }}
                >
                  <div
                    style={{
                      marginBottom: isMobile ? "0" : "3rem",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMobile ? "center" : "stretch",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{ fontWeight: "bold", fontSize: "1.125rem" }}
                      >
                        PaO2
                      </span>
                      <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                        {paO2}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: isMobile ? "2.5rem" : "100%",
                          height: isMobile ? "250px" : "1.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: isMobile ? "0.5rem" : "100%",
                            height: isMobile ? "100%" : "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: isMobile ? 0 : "auto",
                            left: isMobile ? "auto" : 0,
                            height: isMobile
                              ? `${(paO2 / 714) * 100}%`
                              : "0.5rem",
                            width: isMobile
                              ? "0.5rem"
                              : `${(paO2 / 714) * 100}%`,
                            backgroundColor: "#fbcfe8",
                            borderRadius: "9999px",
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="714"
                          value={paO2}
                          onChange={(e) => setPaO2(Number(e.target.value))}
                          className="custom-slider"
                          style={{
                            position: "absolute",
                            width: isMobile ? "250px" : "100%",
                            height: "1.5rem",
                            background: "transparent",
                            transform: isMobile ? "rotate(-90deg)" : "none",
                            transformOrigin: "center center",
                            margin: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          display: "flex",
                          flexDirection: isMobile ? "column-reverse" : "row",
                          justifyContent: "space-between",
                          height: isMobile ? "250px" : "auto",
                          width: isMobile ? "auto" : "100%",
                          marginTop: isMobile ? "0" : "0.5rem",
                          marginLeft: isMobile ? "1rem" : "0",
                          padding: isMobile ? "0" : "0 0.25rem",
                        }}
                      >
                        {[0, 100, 200, 300, 400, 500, 600, 714].map((val) => (
                          <span
                            key={val}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMobile ? "center" : "stretch",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem",
                      }}
                    >
                      <span
                        style={{ fontWeight: "bold", fontSize: "1.125rem" }}
                      >
                        PaCO2
                      </span>
                      <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                        {paCO2}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: isMobile ? "row" : "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          width: isMobile ? "2.5rem" : "100%",
                          height: isMobile ? "250px" : "1.5rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            width: isMobile ? "0.5rem" : "100%",
                            height: isMobile ? "100%" : "0.5rem",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "9999px",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: isMobile ? 0 : "auto",
                            left: isMobile ? "auto" : 0,
                            height: isMobile
                              ? `${(paCO2 / 110) * 100}%`
                              : "0.5rem",
                            width: isMobile
                              ? "0.5rem"
                              : `${(paCO2 / 110) * 100}%`,
                            backgroundColor: "#fbcfe8",
                            borderRadius: "9999px",
                          }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="110"
                          value={paCO2}
                          onChange={(e) => setPaCO2(Number(e.target.value))}
                          className="custom-slider"
                          style={{
                            position: "absolute",
                            width: isMobile ? "250px" : "100%",
                            height: "1.5rem",
                            background: "transparent",
                            transform: isMobile ? "rotate(-90deg)" : "none",
                            transformOrigin: "center center",
                            margin: 0,
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                          display: "flex",
                          flexDirection: isMobile ? "column-reverse" : "row",
                          justifyContent: "space-between",
                          height: isMobile ? "250px" : "auto",
                          width: isMobile ? "auto" : "100%",
                          marginTop: isMobile ? "0" : "0.5rem",
                          marginLeft: isMobile ? "1rem" : "0",
                          padding: isMobile ? "0" : "0 0.25rem",
                        }}
                      >
                        {[0, 20, 40, 60, 80, 100, 110].map((val) => (
                          <span
                            key={val}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: A/a Gradient Output Table */}
            <div
              style={{
                width: "100%",
                flex: "1 1 400px",
                maxWidth: "36rem",
              }}
            >
              {paO2 >= 100 && (
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    minHeight: "165px", // Matches the approximate height of the table block
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.125rem",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    A/a Gradient
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "#4b5563",
                      lineHeight: "1.5",
                    }}
                  >
                    Values reflect{" "}
                    <span style={{ fontWeight: "bold", color: "#111827" }}>
                      Physiological
                    </span>
                    <span style={{ fontWeight: "bold", color: "#111827" }}>
                      {" "}
                      incompatibility.
                    </span>
                  </div>
                </div>
              )}

              {paO2 < 100 && (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    boxShadow:
                      "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
                    marginBottom: "1.5rem",
                    overflow: "hidden", // Ensures the row background colors respect the rounded corners
                  }}
                >
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: "0.875rem",
                    }}
                  >
                    <tbody>
                      {/* Top Header Row (A, a, Gradient) */}
                      <tr
                        style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                      >
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          A
                        </td>
                        <td
                          style={{
                            padding: "0.5rem",
                            textAlign: "center",
                            width: "20%",
                          }}
                        >
                          a
                        </td>
                        <td style={{ padding: "0.5rem", width: "10%" }}></td>
                        <td
                          style={{
                            padding: "0.5rem 1rem",
                            textAlign: "right",
                            width: "50%",
                          }}
                        >
                          Gradient
                        </td>
                      </tr>

                      {/* Top Data Row */}
                      <tr
                        style={{ backgroundColor: "white", color: "#111827" }}
                      >
                        <td
                          colSpan={2}
                          style={{
                            padding: "0.75rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          {((fiO2 / 100) * (760 - 47) - paCO2 / 0.8).toFixed(2)}{" "}
                          - {paO2}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          =
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            textAlign: "right",
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                          }}
                        >
                          {(
                            (fiO2 / 100) * (760 - 47) -
                            paCO2 / 0.8 -
                            paO2
                          ).toFixed(2)}
                        </td>
                      </tr>

                      {/* Bottom Header Row (PaO2, FiO2, Ratio) */}
                      <tr
                        style={{ backgroundColor: "#f3f4f6", color: "#374151" }}
                      >
                        <td style={{ padding: "0.5rem", textAlign: "center" }}>
                          PaO<sub>2</sub>
                        </td>
                        <td style={{ padding: "0.5rem", textAlign: "center" }}>
                          FiO<sub>2</sub>
                        </td>
                        <td style={{ padding: "0.5rem" }}></td>
                        <td
                          style={{ padding: "0.5rem 1rem", textAlign: "right" }}
                        >
                          Ratio
                        </td>
                      </tr>

                      {/* Bottom Data Row */}
                      <tr
                        style={{ backgroundColor: "white", color: "#111827" }}
                      >
                        <td
                          colSpan={2}
                          style={{
                            padding: "0.75rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          {paO2} / {(fiO2 / 100).toFixed(2)}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: "1rem",
                          }}
                        >
                          =
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            textAlign: "right",
                            fontWeight: "bold",
                            fontSize: "1.125rem",
                          }}
                        >
                          {(paO2 / (fiO2 / 100)).toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Aagradient;
