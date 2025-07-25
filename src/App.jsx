import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Questions from "./pages/Questions";
import KeywordQuestions from "./pages/KeywordQuestions";
import OnboardingQuestions from "./pages/OnboardingQuestions";
import Packages from "./pages/Packages";
import Settings from "./pages/Settings";
import UserAnalysis from "./pages/UserAnalysis";
import UserAnswersAnalysis from "./pages/UserAnswersAnalysis";
import AdminAskUser from "./pages/AdminAskUser";
import MentorEngine from "./pages/MentorEngine";
import OpenAITest from "./pages/OpenAITest";
import UserJourney from "./pages/UserJourney";
import AllRecommendationsAdmin from "./components/AllRecommendationsAdmin";
import ReadChapter from "./pages/ReadChapter";
import Landing from "./pages/Landing";
import ThankYou from "./pages/ThankYou";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* דפי נחיתה – ללא Sidebar */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* כל שאר הדפים – עם Sidebar */}
        <Route
          path="*"
          element={
            <div className="flex">
              <Sidebar />
              <div className="flex-1 p-6 bg-white min-h-screen">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/questions" element={<Questions />} />
                  <Route path="/keyword-questions" element={<KeywordQuestions />} />
                  <Route path="/onboarding-questions" element={<OnboardingQuestions />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/user-analysis" element={<UserAnalysis />} />
                  <Route path="/user-answers-analysis" element={<UserAnswersAnalysis />} />
                  <Route path="/admin-ask-user" element={<AdminAskUser />} />
                  <Route path="/mentor-engine" element={<MentorEngine />} />
                  <Route path="/openai-demo" element={<OpenAITest />} />
                  <Route path="/user-journey/:id" element={<UserJourney />} />
                  <Route path="/recommendations" element={<AllRecommendationsAdmin />} />
                  <Route path="/read-chapter/:chapterNumber" element={<ReadChapter />} />
                  <Route path="*" element={<Dashboard />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
