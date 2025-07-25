import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AdminRecommendationForm() {
  const [userId, setUserId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    if (!userId || !adminName || !recommendation) {
      setStatus("error");
      return;
    }

    try {
      const { error } = await supabase.from("admin_recommendations").insert([
        {
          user_id: userId,
          admin_name: adminName,
          recommendation_text: recommendation,
        },
      ]);

      if (error) {
        console.error("❌ Error inserting:", error);
        setStatus("error");
      } else {
        console.log("✅ Recommendation submitted!");
        setStatus("success");
        setUserId("");
        setAdminName("");
        setRecommendation("");
      }
    } catch (err) {
      console.error("❌ Exception:", err);
      setStatus("error");
    }
  };

  return (
    <div
      style={{
        marginTop: "40px",
        borderTop: "2px solid #eee",
        paddingTop: "20px",
      }}
    >
      <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
        ➕ Add New Recommendation
      </h3>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>User ID:</label><br />
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
            placeholder="e.g. 123e4567-e89b-12d3-a456-426614174000"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Admin Name:</label><br />
          <input
            type="text"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            style={{ width: "100%", padding: "6px" }}
            placeholder="e.g. Admin A"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Recommendation Text:</label><br />
          <textarea
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            style={{ width: "100%", padding: "6px", minHeight: "80px" }}
            placeholder="Write the recommendation..."
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 12px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          📤 Submit Recommendation
        </button>
      </form>

      {/* Status Message */}
      {status === "success" && (
        <div style={{ marginTop: "10px", color: "green" }}>
          ✅ Recommendation submitted successfully.
        </div>
      )}
      {status === "error" && (
        <div style={{ marginTop: "10px", color: "red" }}>
          ❌ Please fill in all fields correctly.
        </div>
      )}
      {status === "loading" && (
        <div style={{ marginTop: "10px", color: "#555" }}>
          ⏳ Submitting recommendation...
        </div>
      )}
    </div>
  );
}
