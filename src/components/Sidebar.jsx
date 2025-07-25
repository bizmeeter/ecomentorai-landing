import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navItem = (to, label, emoji) => (
    <li className={`mb-2 ${location.pathname === to ? "font-bold text-blue-600" : ""}`}>
      <Link to={to} className="flex items-center space-x-2">
        <span>{emoji}</span>
        <span>{label}</span>
      </Link>
    </li>
  );

  return (
    <div className="w-64 min-h-screen p-4 bg-gray-100 border-r">
      <h2 className="text-xl font-bold mb-6">📘 Ecomentor Admin</h2>
      <ul>
        {navItem("/dashboard", "🏠 Dashboard", "🏠")}
        {navItem("/mentor-engine", "📋 User Journey", "📋")}
        {navItem("/users", "👥 Users", "👥")}
        {navItem("/reports", "📈 Reports", "📈")}
        {navItem("/questions", "❓ Manage Questions", "❓")}
        {navItem("/keyword-questions", "🔑 Keyword Questions", "🔑")}
        {navItem("/onboarding-questions", "📝 Onboarding Questions", "📝")}
        {navItem("/packages", "📦 Package Management", "📦")}
        {navItem("/settings", "⚙️ Settings", "⚙️")}
        {navItem("/user-analysis", "📊 User Analysis", "📊")}
        {navItem("/user-answers-analysis", "📂 Answers Analysis", "📂")}
        {navItem("/admin-ask-user", "🎯 Ask for User", "🎯")}
        {navItem("/mentor-engine", "🧠 Mentor Engine", "🧠")}

        {/* קישור חדש לקריאת ספר */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">Content</h3>
          {navItem("/read-chapter/1", "📖 Read Book", "📖")}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">AI Tools</h3>
          {navItem("/openai-demo", "🤖 OpenAI Test (V1)", "🤖")}
        </div>
      </ul>
    </div>
  );
};

export default Sidebar;
