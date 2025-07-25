import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminRecommendationForm from "./AdminRecommendationForm"; // שלב 2

export default function AllRecommendationsAdmin() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("admin_recommendations")
        .select("id, user_id, recommendation_text, admin_name, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setRecommendations(data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        📄 All Admin Recommendations
      </h2>

      {/* Error */}
      {error && (
        <div style={{ background: '#fdd', padding: '10px', marginBottom: '20px' }}>
          ❌ {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div>⏳ Loading...</div>
      ) : recommendations.length === 0 ? (
        <div>📝 No recommendations found.</div>
      ) : (
        <div>
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '15px',
                marginBottom: '15px',
                background: '#fff',
              }}
            >
              <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                {rec.recommendation_text}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                👤 <strong>{rec.admin_name || "Unknown Admin"}</strong>{" "}
                → User ID: {rec.user_id} <br />
                🕒 {new Date(rec.created_at).toLocaleString("he-IL")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* שלב 2 – טופס הוספת המלצה */}
      <AdminRecommendationForm />
    </div>
  );
}
