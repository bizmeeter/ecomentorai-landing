import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminRecommendationList({ userId, reload }) {
  const [recs, setRecs] = useState([]);

  const fetchRecommendations = async () => {
    const { data, error } = await supabase
      .from("admin_recommendations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Error loading recommendations:", error.message);
    } else {
      setRecs(data || []);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchRecommendations();
    }
  }, [userId, reload]); // 👈 מתרענן בכל שינוי ב־reload

  return (
    <div className="space-y-3 mt-6">
      <h4 className="text-lg font-semibold">📂 Previous Recommendations</h4>

      {recs.length === 0 ? (
        <p className="text-gray-500">No recommendations found.</p>
      ) : (
        recs.map((rec) => (
          <Card key={rec.id}>
            <CardContent className="p-3">
              <p>{rec.recommendation_text}</p>
              <div className="text-sm text-gray-500 mt-2">
                Sent by <strong>{rec.admin_name}</strong> on{" "}
                {new Date(rec.created_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
